import React, { useRef, useState } from "react";
import { supabase } from "../config/supabase";

export const InputForm: React.FC = () => {
  const frontFileInputRef = useRef(null);
  const backFileInputRef = useRef(null);

  const handleFrontFileClick = () => {
    frontFileInputRef.current.click();
  };

  const handleBackFileClick = () => {
    backFileInputRef.current.click();
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    ssn: "",
    gender: "",
    dob: "",
    front_id: "",
    back_id: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, fileType) => {
    setFormData({ ...formData, [fileType]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {

      const frontFileUpload = await supabase.storage
        .from("jovie")
        .upload(`front/${formData.front_id}`, formData.front_id);

      // Upload back file to Supabase Storage
      const backFileUpload = await supabase.storage
        .from("jovie")
        .upload(`back/${formData.back_id}`, formData.back_id);

      // Get the public URLs for the uploaded files
      const frontFileUrl = `https://${supabase.projectURL}/storage/v1/object/public/${frontFileUpload.data?.path}`;
      const backFileUrl = `https://${supabase.projectURL}/storage/v1/object/public/${backFileUpload.data?.path}`;

      const { error } = await supabase.from("user_information").insert([formData]);
  
      if (error) {
        console.error("Error saving data:", error.message);
      } else {
        console.log("Data saved successfully!");
        // Reset form data or perform any other necessary actions
        setFormData({
          ...formData,
          front_id: frontFileUrl,
          back_id: backFileUrl,
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="m-6 flex justify-center">
      <div className="flex justify-center bg-white p-10 flex-col rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit}>
        <div className="pb-6">
          <h1 className="text-[#2e3f51] font-semibold text-2xl text-center">
            Application Form
          </h1>
        </div>
        <div className="flex justify-start pb-4">
          <p className="text-start">* Indicates a required field</p>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#2e3f51]">
              FirstName*
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="border-2 border-[#949494] w-fit p-3 rounded-md"
              placeholder="Enter your first name"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#2e3f51]">
              LastName*
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="border-2 border-[#949494] w-fit p-3 rounded-md"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        <div className="py-5">
          <label className="text-sm font-semibold text-[#2e3f51]">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border-2 border-[#949494] w-full p-3 rounded-md"
            placeholder="Enter your personal email address"
          />
        </div>
        <div className="">
          <label className="text-sm font-semibold text-[#2e3f51]">Phone*</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="border-2 border-[#949494] w-full p-3 rounded-md"
            placeholder="(000) 000-0000"
          />
        </div>
        <div className="py-5">
          <label className="text-sm font-semibold text-[#2e3f51]">
            Social Security Number*
          </label>
          <input
            type="text"
            name="ssn"
            value={formData.ssn}
            onChange={handleChange}
            id=""
            className="border-2 border-[#949494] w-full p-3 rounded-md"
            placeholder=""
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#2e3f51]">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            id="gender_field"
            className="border-2 border-[#949494] w-full p-3 rounded-md text-sm"
          >
            <option value="">Please Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="py-5">
          <label className="text-sm font-semibold text-[#2e3f51]">
            Date of birth*
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            id=""
            className="border-2 border-[#949494] w-full p-3 rounded-md"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">
              Driver's License/State ID FRONT
              <span className="text-xs text-amber-800 inline-flex items-center pr-5">
                make sure it is clear
              </span>
            </label>
            <div
              className="border-2 border-gray-600 border-dashed rounded-md p-2"
              onClick={handleFrontFileClick}
            >
              <div className="flex flex-col items-center space-y-1">
                <img
                  src="https://jovie-job.pages.dev/preform/assets/icons/login/upload.png"
                  width="40px"
                />
                <h4 className="text-[#2e3f51] font-semibold">Browse Files</h4>
                <span className="text-gray-500 text-sm font-semibold">
                  Choose a file
                </span>
              </div>
            </div>
            <input
              type="file"
              ref={frontFileInputRef}
              name="front_id"
              id="front_id"
              onChange={(e) => handleFileChange(e, "front_id")}
              hidden
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">
              Driver's License/State ID BACK
              <span className="text-xs text-amber-800 inline-flex items-center pr-5">
                make sure it is clear
              </span>{" "}
            </label>
            <div
              className="border-2 border-gray-600 border-dashed rounded-md p-4"
              onClick={handleBackFileClick}
            >
              <div className="flex flex-col items-center space-y-1">
                <img
                  src="https://jovie-job.pages.dev/preform/assets/icons/login/upload.png"
                  width="40px"
                />
                <h4 className="text-[#2e3f51] font-semibold">Browse Files</h4>
                <span className="text-gray-500 text-sm font-semibold">
                  Choose a file
                </span>
                <input type="file" name="" id="" hidden />
              </div>
            </div>
            <input
              type="file"
              ref={backFileInputRef}
              name="back_id"
              id="back_id"
              onChange={(e) => handleFileChange(e, "back_id")}
              hidden
            />
          </div>
        </div>
        <div className="py-8">
          <div className="flex items-center">
            <input type="checkbox" name="" id="" className="p-4" />
            <label className="text-[#2e3f51] text-sm ml-2">
              I accept jovie's{" "}
              <a href="" className="underline text-blue-600">
              Terms of Service
                </a> and {" "}
                <a href="" className="underline text-blue-600">
                 Privacy Policy 
                 </a>*
            </label>
          </div>
        </div>
        <div className="flex justify-center py-6">
          <button className="bg-blue-600 font-semibold text-white p-3 rounded-md w-full"
          type="submit"
          >
            APPLY NOW
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};