import { n as globalThrottleQueue, t as debounceController } from "./debounce-C70-rAd_.js";
import { c as debug } from "./context-DRdo5A2P.js";

//#region src/lib/queues/reset.ts
let mutex = 0;
function setQueueResetMutex(value = 1) {
	mutex = value;
}
function spinQueueResetMutex() {
	mutex = Math.max(0, mutex - 1);
	if (mutex > 0) return;
	resetQueues();
}
function resetQueues() {
	debug("[nuqs] Aborting queues");
	debounceController.abortAll();
	globalThrottleQueue.abort().forEach((key) => debounceController.queuedQuerySync.emit(key));
}

//#endregion
export { setQueueResetMutex as n, spinQueueResetMutex as r, resetQueues as t };
//# sourceMappingURL=reset-CKsIu3sM.js.map