// "use client";

// import { useEffect, useState } from "react";
// import { useWindowWidth } from "@/hooks/use-window-width";
// import { cn } from "@/lib/utils";
// import { CircleCheckIcon, CircleXIcon } from "lucide-react";

// import {
//     GroupAvailability,
//     PersonalAvailability,
// } from "../components/availability";
// import {
//     generateSampleDates,
//     generateTimeBlocks,
//     getGeneralAvailability,
//     getTimeFromHourMinuteString,
// } from "../utils/availability";

// export default function Page({ data }) {
//     const [currentTab, setCurrentTab] = useState(0);

//     const [startTime, setStartTime] = useState("");
//     const [endTime, setEndTime] = useState("");
//     const [availabilityDates, setAvailabilityDates] = useState([]);
//     const [availabilityTimeBlocks, setAvailabilityTimeBlocks] = useState([]);
//     const [isEditingAvailability, setIsEditingAvailability] = useState(false);
//     const [isStateUnsaved, setIsStateUnsaved] = useState(false);
//     const [guestSession, setGuestSession] = useState({
//         guestName: "",
//         meetingId: "",
//     });

//     const { mobileView } = useWindowWidth();

//     useEffect(() => {
//         setStartTime(data.meetingData.from_time);
//         setEndTime(data.meetingData.to_time);
//     }, [data.meetingData]);

//     useEffect(() => {
//         setAvailabilityTimeBlocks(
//             generateTimeBlocks(
//                 getTimeFromHourMinuteString(startTime),
//                 getTimeFromHourMinuteString(endTime)
//             )
//         );
//     }, [startTime, endTime]);

//     const handleSave = async (cancel) => {
//         if (data.user) {
//             return;
//         }

//         if (guestSession.guestName && guestSession.meetingId) {
//             return;
//         }

//         const authModal = document.getElementById("auth-modal");

//         if (authModal) {
//             authModal.showModal();
//         }

//         cancel();
//     };

//     const handleCancel = async () => {
//         const availability = await getGeneralAvailability(data, guestSession);
//         setAvailabilityDates(availability || generateSampleDates());
//         setIsEditingAvailability(!isEditingAvailability);
//         setIsStateUnsaved(false);
//     };

//     const handleFormSubmit = async (event) => {
//         event.preventDefault();
//         let cancelled = false;
//         const cancel = () => {
//             cancelled = true;
//         };
//         await handleSave(cancel);
//         if (cancelled) return;

//         console.log("Saving Availability");

//         const formData = new FormData(event.target);
//         const response = await fetch(event.target.action, {
//             method: event.target.method,
//             body: formData,
//         });

//         if (response.ok) {
//             setIsEditingAvailability(false);
//             setIsStateUnsaved(false);
//         } else {
//             // Handle error
//         }
//     };

//     return (
//         <div>
//             <div className="flex-between px-2 pt-8 md:px-4 md:pt-10 lg:px-[60px]">
//                 <h1 className="font-montserrat line-clamp-1 h-8 pr-2 text-xl font-medium md:h-fit md:text-3xl">
//                     {data.meetingData.title}
//                 </h1>

//                 {isEditingAvailability && (
//                     <div className="flex space-x-2 md:space-x-4">
//                         <button
//                             className={cn(
//                                 "flex-center btn btn-outline border-warning text-warning h-8 min-h-fit px-2 uppercase md:w-28 md:p-0",
//                                 "hover:border-warning hover:bg-warning hover:text-white"
//                             )}
//                             onClick={handleCancel}
//                         >
//                             <span className="hidden md:flex">Cancel</span>
//                             <CircleXIcon />
//                         </button>

//                         <form
//                             action={`/availability/${data.meetingId}?/save`}
//                             method="POST"
//                             id="availability-save-form"
//                             onSubmit={handleFormSubmit}
//                         >
//                             <input
//                                 type="hidden"
//                                 name="availabilityDates"
//                                 value={JSON.stringify(availabilityDates)}
//                             />
//                             <input
//                                 type="hidden"
//                                 name="username"
//                                 value={guestSession.guestName}
//                             />
//                             <input
//                                 type="hidden"
//                                 name="meetingId"
//                                 value={data.meetingId || ""}
//                             />
//                             <button
//                                 className={cn(
//                                     "flex-center btn btn-outline h-8 min-h-fit border-secondary px-2 uppercase text-secondary md:w-24 md:p-0",
//                                     "hover:border-secondary hover:bg-secondary hover:text-white"
//                                 )}
//                                 type="submit"
//                             >
//                                 <span className="hidden md:flex">Save</span>
//                                 <CircleCheckIcon />
//                             </button>
//                         </form>
//                     </div>
//                 )}
//             </div>

//             <div
//                 role="tablist"
//                 className="tabs tabs-bordered w-full px-2 md:px-4 lg:max-w-md lg:pl-[60px]"
//             >
//                 <button
//                     role="tab"
//                     className={cn(
//                         "tab font-montserrat font-medium text-gray-400 lg:text-lg",
//                         { "tab-active": currentTab === 0 },
//                         { "text-gray-800": currentTab === 0 }
//                     )}
//                     style={{
//                         borderColor:
//                             currentTab === 0 ? "oklch(var(--a))" : undefined,
//                     }}
//                     onClick={() => setCurrentTab(0)}
//                 >
//                     My Availability
//                 </button>
//                 <button
//                     role="tab"
//                     className={cn(
//                         "tab font-montserrat font-medium text-gray-400 lg:text-lg",
//                         { "tab-active": currentTab === 1 },
//                         { "text-gray-800": currentTab === 1 }
//                     )}
//                     style={{
//                         borderColor:
//                             currentTab === 1 ? "oklch(var(--a))" : undefined,
//                     }}
//                     onClick={() => setCurrentTab(1)}
//                 >
//                     Group Availability
//                 </button>
//             </div>

//             <div>
//                 {currentTab === 0 && (
//                     <div className="rounded-box border-base-300 bg-base-100 w-full bg-gradient-to-l from-[#F680670D] to-[#377CFB0D] p-2 pt-4 md:p-6">
//                         <PersonalAvailability
//                             columns={mobileView ? 4 : 5}
//                             data={data}
//                         />
//                     </div>
//                 )}
//                 {currentTab === 1 && (
//                     <div className="rounded-box border-base-300 bg-base-100 bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] p-2 pt-4 md:p-6 lg:pr-0">
//                         <div className="hidden md:flex md:items-start">
//                             <GroupAvailability columns={5} />
//                         </div>
//                         <div className="block md:hidden">
//                             <GroupAvailability columns={4} />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
