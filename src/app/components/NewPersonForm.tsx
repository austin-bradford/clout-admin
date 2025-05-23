import { useEffect, useState } from "react";

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

export default function NewPersonForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  // Function to handle form submission & create a new record in Airtable
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const name = (
      event.currentTarget.elements.namedItem("name") as HTMLInputElement
    ).value;
    const organizer = (
      event.currentTarget.elements.namedItem("organizer") as HTMLSelectElement
    ).value;
    const networkMember = (
      event.currentTarget.elements.namedItem(
        "networkMember"
      ) as HTMLSelectElement
    ).value;
    const teamMember = [
      (
        event.currentTarget.elements.namedItem(
          "teamMember"
        ) as HTMLSelectElement
      ).value,
    ];
    const email = (
      event.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const phone = (
      event.currentTarget.elements.namedItem("phone") as HTMLInputElement
    ).value;
    const address = (
      event.currentTarget.elements.namedItem("address") as HTMLInputElement
    ).value;
    const notes = (
      event.currentTarget.elements.namedItem("notes") as HTMLTextAreaElement
    ).value;
    event.preventDefault();
    try {
      if (!base) {
        console.error("Airtable base is not initialized.");
        return;
      }
      console.log(teamMember);

      console.log("Form submitted:", {
        name,
        organizer,
        networkMember,
        teamMember,
        email,
        phone,
        address,
        notes,
      });
      base("People")
        .create([
          {
            fields: {
              Name: name,
              Organizer: organizer,
              "Network Member": networkMember,
              "Team Member": teamMember,
              Email: email,
              Phone: phone,
              Address: address,
              Notes: notes,
            },
          },
        ])
        .then((records: any) => {
          console.log("Created records:", records);
        })
        .catch((error: any) => {
          console.error("Error creating records:", error);
        });
      // Close the form after submission
      handleClose();
      // create a notification in the top right corner stating that the person was created
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg";
      notification.innerText = `Person ${name} created successfully!`;
      document.body.appendChild(notification);
      // Remove the notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // create a popup in the middle of the screen stating that there was an error and to try again with a button to close it
      const errorPopup = document.createElement("div");
      errorPopup.className =
        "fixed top-1/2 left-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2";
      errorPopup.innerText = "Error creating person. Please try again.";
      document.body.appendChild(errorPopup);
      // create a button to close the error popup
      const closeButton = document.createElement("button");
      closeButton.className = "mt-2 bg-red-600 text-white py-1 px-4 rounded-lg";
      closeButton.innerText = "Close";
      closeButton.onclick = () => {
        document.body.removeChild(errorPopup);
      };
      errorPopup.appendChild(closeButton);
    }
  };
  // Close the form when the user clicks outside of it
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

  useEffect(() => {
    // Prevent background scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  // List of team members
  // This should be fetched from Airtable in a real application

  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  // Fetch team members from Airtable
  const fetchTeamMembers = async () => {
    if (!base) return;
    try {
      const records = await base("People")
        .select({
          fields: ["Team Member"],
        })
        .firstPage();
      const allMembers = records.map(
        (record: any) => record.fields["Team Member"]
      );
      // Filter out empty values and remove duplicates
      const duplicateMembers = allMembers
        .filter((member: any) => member !== undefined)
        .flat();
      const members = Array.from(new Set(duplicateMembers));
      // alphabetically sort the team members
      members.sort();
      // Set the team members state
      setTeamMembers(members as string[]);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };
  // Fetch team members when the component mounts
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return (
    // Form to create a new person
    <form
      onSubmit={handleSubmit}
      className="newpersonform modal-content flex flex-col gap-6 w-full max-w-lg mx-auto bg-white py-12 px-10 rounded-2xl shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto animate-fadeInForm"
    >
      <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700">
        New Person
      </h2>
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700">Name</label>
        <input
          type="text"
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="name"
          placeholder="Enter full name"
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
      {/* Network Member */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700">Network Member</label>
        <select
          name="networkMember"
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>
            Select network member status
          </option>
          <option>Yes</option>
          <option>No</option>
          <option>Not applicable</option>
        </select>
      </div>
      {/* Team Member */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700">Team Member</label>
        <select
          name="teamMember"
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option defaultChecked value="">
            Select a team member
          </option>
          {teamMembers.map((member, index) => (
            <option key={index} value={member}>
              {member}
            </option>
          ))}
        </select>
      </div>
      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          placeholder="example@email.com"
        />
      </div>
      {/* Phone */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          placeholder="(555) 555-5555"
        />
      </div>
      {/* Address */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          placeholder="123 Main St, City, State"
        />
      </div>
      {/* Notes */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700">Notes</label>
        <textarea
          name="notes"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px]"
          placeholder="Additional notes (optional)"
        />
      </div>
      {/* Submit and Cancel buttons */}
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
