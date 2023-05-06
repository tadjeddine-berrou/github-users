import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, combineLatest, forkJoin, map, of, switchMap, takeUntil } from 'rxjs';
import { User, UserListState, UserProfile } from '@users/utils/models/user.model';

@Injectable()
export class UserService {

  private _token: string | null = null;

  private readonly _initialState: UserListState = {
    list: [],
    pagination: {
      pageSize: 12,
      prevLink: null,
      nextLink: null
    },
    httpState: {
      status: 'static'
    }
  };
  private _userListState$: BehaviorSubject<UserListState> = new BehaviorSubject<UserListState>(this._initialState);

  private readonly _baseAPI: string = 'https://api.github.com';
  private _headers: HttpHeaders = new HttpHeaders({});

  private _cancelUserListFetch$: Subject<void> = new Subject<void>();

  constructor(private httpClient: HttpClient) {
    this.setHeaders();
  }

  get userListState$(): Observable<UserListState> {
    return this._userListState$.asObservable();
  }

  get userListState(): UserListState {
    return this._userListState$.getValue();
  }

  getUserList(params?: { prev?: boolean; next?: boolean; }): void {
    /** contruct the url */
    let _url: string = `${this._baseAPI}/users`;
    let loadDir: 'prev' | 'next' | null = null;
    const { nextLink, prevLink, pageSize } = this.userListState.pagination;
    if (params?.next && nextLink) {
      _url = nextLink;
      loadDir = 'next';
    } else if (params?.prev && prevLink) {
      _url = prevLink;
      loadDir = 'prev';
    }

    const url = new URL(_url);
    url.searchParams.set('per_page', String(pageSize));

    /** set http status to loading */
    this._userListState$.next({
      ...this.userListState,
      httpState: {
        status: 'loading',
        dir: loadDir
      }
    });

    this.httpClient.get<User[]>(url.toString(), { headers: this._headers, observe: 'response' }).pipe(
      takeUntil(this._cancelUserListFetch$),
      switchMap(response => of({ link: response.headers.get('link'), users: response.body!})),
      switchMap(data => combineLatest([
        forkJoin(data.users.map(
          user => this.getUserProfile(user.login).pipe(
            map(profile => ({ ...user, profile }))
          )
        )),
        of(data.link)
      ]))
    ).subscribe({
      next: ([users, link]) => {
        const { prevLink, nextLink } = this.getUserListPaginationLink(link, users[0].id)
        this._userListState$.next({
          ...this.userListState,
          list: users,
          pagination: {
            ...this.userListState.pagination,
            prevLink,
            nextLink
          },
          httpState: {
            status: 'success',
            dir: loadDir
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        /** set http status to error */
        this._userListState$.next({
          ...this.userListState,
          httpState: {
            status: 'error',
            message: error?.error?.message || 'An error has occured',
            dir: loadDir
          }
        });
      }
    });
  }

  getUserProfile(username: string): Observable<UserProfile> {
    const url: string = `${this._baseAPI}/users/${username}`;
    return this.httpClient.get<UserProfile>(url, { headers: this._headers });
  }

  getUserListPaginationLink(link: string | null, firstUserId: number): { prevLink: string | null; nextLink: string | null; } {
    let nextLink: string | null = null;
    let prevLink: string | null = null;
    const nextPattern: RegExp = /(?<=<)([\S]*)(?=>; rel="Next")/i;
    const prevPattern: RegExp = /(?<=<)([\S]*)(?=>; rel="Prev")/i;

    nextLink = link?.match(nextPattern)?.[0] || null;
    prevLink = link?.match(prevPattern)?.[0] || null;
    /** special case: the github API is not returning prev link in the response header
     * to fix this, we can check "since" param and construct the prev link
     */
    if (!prevLink && firstUserId > 1) {
      const pageSize: number = this.userListState.pagination.pageSize;
      let prevPageStart = firstUserId - pageSize;
      if (prevPageStart < 0) prevPageStart = 0;
      prevLink = `https://api.github.com/users?per_page=${pageSize}&since=${prevPageStart}`
    }

    return ({ prevLink, nextLink });
  }

  cancelUserListFetch(): void {
    this._cancelUserListFetch$.next();
    this._userListState$.next(this._initialState);
  }

  setToken(token: string): void {
    this._token = token;
    this.setHeaders();
  }

  setHeaders(): void {
    this._headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(this._token && { 'Authorization': `Bearer ${this._token}` })
    });
  }
}
