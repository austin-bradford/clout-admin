"use client";
import React from "react";
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

export default function Home() {
  const [totalCommitments, setTotalCommitments] = React.useState<number>(0);

  //fetching the commitments from airtable
  const fetchCommitments = async () => {
    if (!base) return;
    try {
      const records = await base("Commitment")
        .select({
          fields: ["Amount"],
        })
        .firstPage();
      const commitments = records.map((record: any) => record.fields["Amount"]);
      // sum all commitments
      const allCommitments = commitments.reduce(
        (acc: number, curr: number) => acc + curr,
        0
      );
      // formatting the number to 2 decimal places
      const formattedCommitments = allCommitments.toFixed(2);
      setTotalCommitments(formattedCommitments);
    } catch (error) {
      console.error("Error fetching commitments:", error);
    }
  };
  // Fetch commitments when the component mounts
  useEffect(() => {
    fetchCommitments();
  }, []);
  console.log(`Total Commitments: $${totalCommitments}`);

  return (
    //grid layout of various graphs
    <div>
      <h1>Investment Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Placeholder for graphs */}
        {/* circle graph displaying the totalCommitments */}
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          <p className="text-2xl font-bold">${totalCommitments}</p>
        </div>
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          Graph 2
        </div>
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          Graph 3
        </div>
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          Graph 4
        </div>
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          Graph 5
        </div>
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          Graph 6
        </div>
      </div>
    </div>
  );
}
