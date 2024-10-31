import { AvailabilityContextProvider } from "@/app/components/availability/context/availability-context";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AvailabilityContextProvider>{children}</AvailabilityContextProvider>
    );
}
