import React, { useState, useEffect } from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import Image from "next/image";

const CloudinaryUpload = ({
  setImgUrl,
  type,
  croping,
}: {
  setImgUrl: (url: string) => void;
  type: string;
  croping: boolean;
}) => {
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (profileImage) {
      console.log("profileImage in widget...", profileImage);
      setImgUrl(profileImage);
    }
  }, [profileImage, setImgUrl]);

  return (
    <div>
      <CldUploadWidget
        uploadPreset="peu0blg2"
        onOpen={() => {
          console.log("isPhotographer");
        }}
        onSuccess={(results: CloudinaryUploadWidgetResults) => {
          const uploadedResult = results.info as CloudinaryUploadWidgetInfo;
          const profileImageURL = {
            image: uploadedResult.secure_url,
          };
          setProfileImage(profileImageURL.image);
        }}
        options={{
          tags: ["organization image"],
          sources: ["local"],
          googleApiKey: "<image_search_google_api_key>",
          showAdvancedOptions: false,
          cropping: croping,
          multiple: false,
          showSkipCropButton: false,
          croppingAspectRatio: 1,
          croppingDefaultSelectionRatio: 1,
          croppingShowDimensions: true,
          croppingCoordinatesMode: "custom",
          defaultSource: "local",
          resourceType: "image",
          folder: "organization",
          styles: {
            palette: {
              window: "#ffffff",
              sourceBg: "#f4f4f5",
              windowBorder: "#90a0b3",
              tabIcon: "#000000",
              inactiveTabIcon: "#555a5f",
              menuIcons: "#555a5f",
              link: "#000000",
              action: "#000000",
              inProgress: "#464646",
              complete: "#000000",
              error: "#cc0000",
              textDark: "#000000",
              textLight: "#fcfffd",
              theme: "white",
            },
          },
        }}
      >
        {({ open }) => (
          <button
            className="w-full   lg:w-full border border-[#0c2735] rounded-2xl border-size-2"
            type="button"
            onClick={() => {
              open();
            }}
          >
            <div className="p-2 w-full   lg:w-full text-black font-semibold flex items-center justify-center gap-2 bg-[#ffffff]  rounded-2xl">
              <FaCloudUploadAlt />
              Upload
            </div>
          </button>
        )}
      </CldUploadWidget>
      {profileImage && (
        <div className="mt-4">
          {profileImage.endsWith(".pdf") && type == "cv" && (
            <a
              href={profileImage}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-24 h-24 text-center p-2 border border-gray-300 rounded-md bg-gray-100"
            >
              View PDF
            </a>
          )}

          {type == "image" && (
            <Image
              src={profileImage}
              alt="Uploaded"
              width={200}
              height={200}
              className="w-36 h-36 object-cover    rounded-md"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
