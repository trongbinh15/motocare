import { Box, Text } from 'zmp-ui';

export function App() {
  return (
    <Box className="min-h-screen bg-white flex items-center justify-center">
      <Box className="text-center">
        <Text.Header>MotoCare</Text.Header>
        <Text className="text-gray-600 mt-2">Ứng dụng theo dõi bảo dưỡng xe máy/ô tô</Text>
      </Box>
    </Box>
  );
}
