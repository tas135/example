
export class Sessions {
  constructor(
    public SessionName: string,
    public Location?: string,
    public ActiveStatus: boolean = true,
    public LiveStatus: boolean = false,
    public DateTime?: string,
    public SessionID?: number
  ) { }
}
