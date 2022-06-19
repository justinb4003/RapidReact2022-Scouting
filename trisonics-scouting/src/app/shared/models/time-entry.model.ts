export interface TimeEntry {
    id: string, // UUID
    in_datetime: Date,
    in_lat: number,
    in_lng: number,
    out_datetime: Date | null,
    out_lat: number | null,
    out_lng: number | null,
    account_name: string,
    secret_team_key: string,
    notes: string | null,
    subteams: string[] | null,
}