import Link from "next/link";

export default function InvestmentPortal() {
  return (
    <Link
      href="/investment-portal"
      className="flex flex-col items-center justify-center py-4 px-8 bg-gray-100 rounded-lg shadow-md w-full hover:border-2 hover:border-blue-500 hover:cursor-pointer"
    >
      <div>Investment Portal</div>
    </Link>
  );
}
