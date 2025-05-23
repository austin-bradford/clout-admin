export default function NewCongregation({
  handleOpen,
}: {
  handleOpen: () => void;
}) {
  return (
    <div
      onClick={handleOpen}
      className="flex flex-col items-center justify-center py-4 px-8 bg-gray-100 rounded-lg shadow-md w-full hover:border-2 hover:border-blue-500 hover:cursor-pointer"
    >
      <div>New Congregation</div>
    </div>
  );
}
