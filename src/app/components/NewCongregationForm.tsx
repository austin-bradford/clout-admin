import { useEffect } from "react";

//configure airtable
var Airtable = require("airtable");
Airtable.configure({
  endpointUrl: process.env.NEXT_PUBLIC_AIRTABLE_API_URL,
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
});
var baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
var base = baseId
  ? new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
      baseId
    )
  : undefined;

export default function NewCongregationForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const organizer = formData.get("organizer") as string;
    // Add the new congregation to Airtable
    if (base) {
      base("Congregation").create(
        [
          {
            fields: {
              Name: name,
              Organizer: organizer,
              "2024 Pledge": "2024",
              "2025 Pledge Year": "2025",
            },
          },
        ],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach(function (record: any) {
            console.log("Congregation added:", record.getId());
          });
        }
      );
    }
    // Close the form after submission
    const form = document.querySelector(".newcongregationform");
    if (form) {
      form.classList.add("animate-fadeOutForm");
    }
    setTimeout(() => {
      handleClose();
    }, 250); // 250ms to match the animation duration
    //create notification of succes in upper right corner
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg animate-fadeInNotification";
    notification.innerText = "Congregation added successfully!";
    document.body.appendChild(notification);
    // Remove the notification after 3 seconds
    setTimeout(() => {
      notification.classList.add("animate-fadeOutNotification");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 250); // 250ms to match the animation duration
    }, 3000); // 3 seconds
  };

  // close the form when the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest(".modal-content")) return;
      handleClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <form
      className="newcongregationform modal-content flex flex-col gap-6 w-full max-w-lg mx-auto bg-white py-12 px-10 rounded-2xl shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto animate-fadeInForm"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700">
        New Congregation
      </h2>
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700">Name</label>
        <input
          type="text"
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="name"
          placeholder="Enter name of congregation"
        />
      </div>
      <div className="flex flex-col gap-1">
        {/* Organizer */}
        <label className="font-semibold text-gray-700">Organizer</label>
        <select
          name="organizer"
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>
            Select organizer
          </option>
          <option>Camille Bradford</option>
          <option>Jon Aden</option>
        </select>
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
      <button
        onClick={handleClose}
        type="button"
        className="mt-4 bg-gray-600 text-white p-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
      >
        Cancel
      </button>
    </form>
  );
}
