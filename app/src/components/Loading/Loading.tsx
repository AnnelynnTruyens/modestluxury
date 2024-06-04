import { useEffect, useState } from "react";

const Loading = () => {
	const [showLoading, setShowLoading] = useState<Boolean>(false);

	// Set timer to wait 1 second before showing the loading indicator
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowLoading(true);
		}, 1000);

		// Cleanup the timer if the component unmounts before the timer completes
		return () => clearTimeout(timer);
	}, []);

	return showLoading ? <div>Loading...</div> : null;
};

export default Loading;
