import { useEffect, useState } from "react";

export function useWindowWidth() {
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const [mobileView, setMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setInnerWidth(window.innerWidth);
            setMobileView(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { innerWidth, mobileView };
}
