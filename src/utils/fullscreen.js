export const enterFullScreen = () => {
	const el = document.documentElement; // Fullscreen whole page
	if (el.requestFullscreen) {
		el.requestFullscreen();
	} else if (el.webkitRequestFullscreen) {
		// Safari
		el.webkitRequestFullscreen();
	} else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	} else if (el.msRequestFullscreen) {
		// IE/Edge
		el.msRequestFullscreen();
	}
};

export const exitFullScreen = () => {
	if (document.fullscreenElement) {
		if (document.exitFullscreen) {
			return document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			// Safari
			return document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			return document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			// IE/Edge
			return document.msExitFullscreen();
		}
	} else {
		console.warn(
			'Cannot exit fullscreen: Document is not in fullscreen mode.'
		);
	}
};
