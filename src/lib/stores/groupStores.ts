// import {writable} from "svelte/store";

import type { Member } from "$lib/types/members";

export const exampleMembers: Member[] = [
  {
    id: "1",
    username: "user1",
    email: "ALP1@gmail.com",
    profile_picture: "https://i.stack.imgur.com/34AD2.jpg",
    profile_page: `/users/user1`,
    created_at: new Date(),
  },
  {
    id: "2",
    username: "user2",
    email: "alp2@gmail.com",
    profile_picture: "https://i.stack.imgur.com/34AD2.jpg",
    profile_page: `/users/user2`,
    created_at: new Date(),
  },
  {
    id: "3",
    username: "user3",
    email: "doglover@gmail.com",
    profile_picture: "https://i.stack.imgur.com/34AD2.jpg",
    profile_page: `/users/user3`,
    created_at: new Date(),
  },
  {
    id: "4",
    username: "user4",
    email: "mentoscandy@gmail.com",
    profile_picture: "https://i.stack.imgur.com/34AD2.jpg",
    profile_page: `/users/user4`,
    created_at: new Date(),
  },
  {
    id: "5",
    username: "user5",
    email: "whousesaolanymore@aol.com",
    profile_picture: "https://i.stack.imgur.com/34AD2.jpg",
    profile_page: `/users/user5`,
    created_at: new Date(),
  },
  {
    id: "6",
    username: "user6",
    email: "outlookuser@outlook.com",
    profile_picture: "https://i.stack.imgur.com/34AD2.jpg",
    profile_page: `/users/user6`,
    created_at: new Date(),
  },
];
