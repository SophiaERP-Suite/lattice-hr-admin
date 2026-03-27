
import { buildInductionItemFormData } from "../components/ItemEditorFields";
import type { InductionItem } from "../types/induction";

const BaseURL = "http://localhost:5127";
const token = localStorage.getItem("token");

export const getInductionAssigmentsByJobSeekerId = async (jobSeekerId: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction-assignment/${jobSeekerId}/${employerId}/jobseeker/admin`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("new loader", response)
  if (!response.ok) throw new Error(`Failed to fetch items (${response.status})`);
  console.log(`Failed to fetch items (${response.status})`)
  return response.json();
};

export const ReassignInductionProgramme = async (assignmentId: number, employerId: number) => {

  const response = await fetch(`${BaseURL}/induction-assignment/${assignmentId}/${employerId}/reassign/admin`, {
    method: "PUT",
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Request failed (${response.status}): ${error}`);
  }

  return response.json();
};

export const UnassignInductionProgramme = async (assignmentId: number, employerId: number) => {

  const response = await fetch(`${BaseURL}/induction-assignment/${assignmentId}/${employerId}/unassign/admin`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Request failed (${response.status}): ${error}`);
  }

  return response.json();
};

export const AssignInductionProgramme = async (data: FormData, employerId: number) => {

  const response = await fetch(`${BaseURL}/induction-assignment/${employerId}/assign/admin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Request failed (${response.status}): ${error}`);
  }

  return response.json();
};

export const getInductionItemsBySection = async (sectionId: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction-items/section/${sectionId}/${employerId}/items/admin`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Failed to fetch items (${response.status})`);
  return response.json();
};

export const updateInductionItem = async (item: InductionItem, itemId: number, employerId: number) => {
  const formData = buildInductionItemFormData(item);

  const response = await fetch(`${BaseURL}/induction-items/item/${itemId}/${employerId}/admin`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Update failed (${response.status}): ${error}`);
  }

  return response.json();
};

export const createInductionItem = async (item: InductionItem, id: number, employerId: number) => {
  const formData = buildInductionItemFormData(item);

  const response = await fetch(`${BaseURL}/induction-items/section/${id}/${employerId}/item/admin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Request failed (${response.status}): ${error}`);
  }

  return response.json();
};

export const updateInductionSection = async (sectionId: number, data: any, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/section/${sectionId}/${employerId}/admin`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};

export const deleteInductionSection = async (sectionId: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/section/${sectionId}/${employerId}/admin`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createInductionSection = async (data: any, id: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/level/${id}/${employerId}/section/admin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};


export const getInductionSectionsBySectionId = async (id: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/${employerId}/section/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionSectionsByLevelId = async (id: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/level/${id}/${employerId}/sections/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionLevelById = async (id: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/${employerId}/level/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const updateInductionCategory = async (inductionCategoryId: number, data: FormData, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${inductionCategoryId}/${employerId}/updateCategory/admin`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return response;
};

export const deleteInductionCategory = async (inductionCategoryId: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${inductionCategoryId}/${employerId}/deleteCategory/admin`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const deleteInductionLevel = async (id: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/${employerId}/level/admin`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const updateInductionLevel = async (data: FormData, id: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/${employerId}/level/admin`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return response;
};

export const createInductionLevel = async (data: FormData, id: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/${employerId}/level/admin`, {
    method: "POST",
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
    body: data,
  });

  return response;
};

export const createInductionCategory = async (data: FormData, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/category/${employerId}/admin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return response;
};

export const getInductionCategoryByCategoryId = async (id: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/${employerId}/byCategoryId/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionCategory = async (id: number, employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/${employerId}/category/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionCategories = async (employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/${employerId}/byEmployer/admin`, {
    method: "GET",
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  return response.json();
};

export const getInductionLevels = async (employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/allLevels/${employerId}/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionSections = async (employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/allSections/${employerId}/admin`, {
    method: "GET",
  });

  return response.json();
};

export const getInductionItems = async (employerId: number) => {
  const response = await fetch(`${BaseURL}/induction/allItems/${employerId}/admin`, {
    method: "GET",
  });

  return response.json();
};

/* ===============================
   ADD SECTION
=================================*/
export const addSection = async (data: {
  inductionLevelID: number;
  sectionName: string;
}) => {

  const formData = new FormData();
  formData.append("inductionLevelID", data.inductionLevelID.toString());
  formData.append("sectionName", data.sectionName);

  return fetch("/induction/section", {
    method: "POST",
    body: formData
  });
};

export const addItem = async (data: FormData) => {



  return fetch("/induction/item", {
    method: "POST",
    body: data
  });
};

export const publishInduction = async (id: number) => {
  return fetch(`/induction/${id}/publish`, {
    method: "POST"
  });
};

export const getInductionBuilder = async (id: number) => {
  return fetch(`/induction/${id}`);
};