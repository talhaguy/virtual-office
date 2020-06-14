export enum IOEvents {
    OnlineUsersChange = "user:onlineUsersChange",
    UserJoinedRoom = "user:joinedRoom",
    UserChat = "user:chat",
}

export enum RoomType {
    QuietRoom = "quietRoom",
    MeetingRoom = "meetingRoom",
    Desks = "desks",
    Break = "break",
}

export enum RegexPatterns {
    Email = "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$",
}
