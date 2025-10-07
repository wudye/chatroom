import { useToast, Box, Button } from '@chakra-ui/react';
import { useEffect } from 'react';


function SWEventHandlers() {
  const toast = useToast();

  useEffect(() => {
    function onOffline() {
      toast({ title: '当前处于离线状态 is true', status: 'warning', duration: 5000, isClosable: true });
    }

    function onUpdated(e: Event) {
      const custom = e as CustomEvent;
      const waitingWorker = custom.detail && custom.detail.waiting;
      if (!waitingWorker) return;

      let toastId: string | number | undefined;

      const reloadSW = async () => {
        try {
          await new Promise((resolve, reject) => {
            const channel = new MessageChannel();
            channel.port1.onmessage = (msg) => {
              if (msg.data?.error) reject(msg.data.error);
              else resolve(msg.data);
            };
            waitingWorker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
          });
        } catch (err) {
          console.error('skip-waiting failed', err);
        }
        // clear caches then reload
        if (window.caches) {
          caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
            .catch(() => null)
            .finally(() => window.location.reload());
        } else {
          window.location.reload();
        }
      };

      toastId = toast({
        position: 'top-right',
        duration: null,
        render: () => (
          <Box color="white" bg="gray.700" p={3} borderRadius="md">
            <Box mb={2}>有新内容</Box>
            <Box mb={2}>请点击“刷新”按钮或者手动刷新页面</Box>
            <Button
              colorScheme="orange"
              size="sm"
              onClick={() => {
                if (toastId !== undefined) toast.close(toastId as string | number);
                reloadSW();
              }}
            >
              刷新
            </Button>
          </Box>
        ),
      });
    }

  window.addEventListener('sw.offline', onOffline);
  // Also listen to the browser's offline event so we can show a toast when the network goes down
  window.addEventListener('offline', onOffline);
    window.addEventListener('sw.updated', onUpdated as EventListener);

    return () => {
      window.removeEventListener('sw.offline', onOffline);
      window.removeEventListener('sw.updated', onUpdated as EventListener);
    };
  }, [toast]);

  return null;
}


export default SWEventHandlers;
