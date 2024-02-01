import { writable } from "svelte/store";

import type { Member } from "$lib/types/members";

const exampleMembers: Member[] = [
  {
    id: "1",
    username: "whodunit",
    email: "ALP1@gmail.com",
    profile_picture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    profile_page: `/users/whodunit`,
    created_at: new Date(),
  },
  {
    id: "2",
    username: "youserone",
    email: "alp2@gmail.com",
    profile_picture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    profile_page: `/users/youserone`,
    created_at: new Date(),
  },
  {
    id: "3",
    username: "salaman",
    email: "doglover@gmail.com",
    profile_picture:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    profile_page: `/users/salaman`,
    created_at: new Date(),
  },
  {
    id: "4",
    username: "george42",
    email: "mentoscandy@gmail.com",
    profile_picture:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    profile_page: `/users/george42`,
    created_at: new Date(),
  },
  {
    id: "5",
    username: "ren2",
    email: "whousesaolanymore@aol.com",
    profile_picture:
      "https://images.unsplash.com/photo-1544168190-79c17527004f?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    profile_page: `/users/ren2`,
    created_at: new Date(),
  },
  {
    id: "6",
    username: "chlo1",
    email: "outlookuser@outlook.com",
    profile_picture:
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    profile_page: `/users/chlo1`,
    created_at: new Date(),
  },
];

export const members = writable<Member[]>(exampleMembers);
