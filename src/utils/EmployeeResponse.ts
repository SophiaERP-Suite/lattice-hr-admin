/* eslint-disable @typescript-eslint/no-explicit-any */
import type { toast } from "react-toastify";


interface Props {
  toast: typeof toast;
}

interface ApplicantFormValues {
  FirstName: string[];
  LastName: string[];
  ProfilePhoto: string[];
  Phone: string[];
  Email: string[];
  IdentificationNumber: string[];
  DateOfBirth: string[];
  Gender: string[];
  Address: string[];
}

interface ErrorResponse {
  message: string;
  errors: ApplicantFormValues;
}

interface DataResponse {
  message: string;
  data: {
    organisationId: number,
    dbsSearchId: number,
  }
}

export const handleCreateEmployee = async (res: any, loader: HTMLElement | null, text: HTMLElement | null, { toast }: Props, reset: any, msg="Data added successfully") => {
  try {
    if (loader) {
      loader.style.display = 'none';
    }
    if (text) {
      text.style.display = 'inline';
    }
    if (res.status === 201 || res.status === 200) {
      const responseData: DataResponse = await res.json();
      console.log(responseData);
      toast.success(responseData.message ?? msg);
      if (reset) {
        reset();
      }
    } else {
      console.log(res.status)
      const resText = await res.text();
      try {
        const responseData: ErrorResponse = JSON.parse(resText);
        console.log('Object Data', responseData)
        if (responseData.errors) {
          const errors: ApplicantFormValues = responseData.errors;
          for (const key in errors) {
            const message = errors[key as keyof ApplicantFormValues];
            if (message && message.length > 0) {
              toast.warning(message[0]);
            }
          }
        } else {
          toast.warning(responseData.message);
          console.log(responseData.message);
        }
      } catch (error: any) {
        console.error("Parsing error:", error.message);
        console.log(resText);
      }
    }
  } catch (err) {
    console.error(err);
    toast.error("An Unexpected Error Occurred");
  }
}

export const handleSearchMatch = async (res: any, { toast }: Props, reset: any, msg="Data added successfully") => {
  try {
    if (res.status === 201 || res.status === 200) {
      const responseData: DataResponse = await res.json();
      console.log(responseData);
      toast.success(responseData.message ?? msg);
      if (reset) {
        reset();
      }
      return responseData;
    } else {
      console.log(res.status)
      const resText = await res.text();
      try {
        const responseData: ErrorResponse = JSON.parse(resText);
        console.log('Object Data', responseData)
        if (responseData.errors) {
          const errors: ApplicantFormValues = responseData.errors;
          for (const key in errors) {
            const message = errors[key as keyof ApplicantFormValues];
            if (message && message.length > 0) {
              toast.warning(message[0]);
            }
          }
        } else {
          toast.warning(responseData.message);
          console.log(responseData.message);
        }
      } catch (error: any) {
        console.error("Parsing error:", error.message);
        console.log(resText);
      }
    }
  } catch (err) {
    console.error(err);
    toast.error("An Unexpected Error Occurred");
  }
}