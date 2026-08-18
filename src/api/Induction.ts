import { buildInductionItemFormData } from "../components/ItemEditorFields";
import type { InductionItem } from "../types/induction";

const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";
const token = localStorage.getItem("token");


export const getInductionAssigmentsByJobSeekerId = async (jobSeekerId: number) => {
  const response = await fetch(`${BaseURL}/induction-assignment/${jobSeekerId}/jobseeker`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("new loader", response)
  if (!response.ok) throw new Error(`Failed to fetch items (${response.status})`);
  console.log(`Failed to fetch items (${response.status})`)
  return response.json();
};

export const ReassignInductionProgramme = async (assignmentId: number) => {

  const response = await fetch(`${BaseURL}/induction-assignment/${assignmentId}/reassign`, {
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

export const UnassignInductionProgramme = async (assignmentId: number) => {

  const response = await fetch(`${BaseURL}/induction-assignment/${assignmentId}/unassign`, {
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

export const AssignInductionProgramme = async (data: FormData) => {

  const response = await fetch(`${BaseURL}/induction-assignment/assign`, {
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

export const getInductionItemsBySection = async (sectionId: number) => {
  const response = await fetch(`${BaseURL}/induction-items/section/${sectionId}/items`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Failed to fetch items (${response.status})`);
  return response.json();
};

export const updateInductionItem = async (item: InductionItem, itemId: number) => {
  const formData = buildInductionItemFormData(item);

  const response = await fetch(`${BaseURL}/induction-items/item/${itemId}`, {
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

export const createInductionItem = async (item: InductionItem, id: number) => {
  const formData = buildInductionItemFormData(item);

  const response = await fetch(`${BaseURL}/induction-items/section/${id}/item`, {
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

export const updateInductionSection = async (sectionId: number, data: any) => {
  const response = await fetch(`${BaseURL}/induction/section/${sectionId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};

export const deleteInductionSection = async (sectionId: number) => {
  const response = await fetch(`${BaseURL}/induction/section/${sectionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createInductionSection = async (data: any, id: number) => {
  const response = await fetch(`${BaseURL}/induction/level/${id}/section`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};


export const getInductionSectionsBySectionId = async (id: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/section`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionSectionsByLevelId = async (id: number) => {
  const response = await fetch(`${BaseURL}/induction/level/${id}/sections`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionLevelById = async (id: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/level`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const updateInductionCategory = async (inductionCategoryId: number, data: FormData) => {
  const response = await fetch(`${BaseURL}/induction/${inductionCategoryId}/updateCategory`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return response;
};

export const deleteInductionCategory = async (inductionCategoryId: number) => {
  const response = await fetch(`${BaseURL}/induction/${inductionCategoryId}/deleteCategory`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const deleteInductionLevel = async (id: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/level`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const updateInductionLevel = async (data: FormData, id: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/level`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return response;
};

export const createInductionLevel = async (data: FormData, id: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/level`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return response;
};

export const createInductionCategory = async (data: FormData) => {
  const response = await fetch(`${BaseURL}/induction/category`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return response;
};

export const getInductionCategoryByCategoryId = async (id: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/byCategoryId`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionCategory = async (id: number) => {
  const response = await fetch(`${BaseURL}/induction/${id}/category`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionCategories = async () => {
  const response = await fetch(`${BaseURL}/induction/byEmployer`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionLevels = async () => {
  const response = await fetch(`${BaseURL}/induction/allLevels`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionSections = async () => {
  const response = await fetch(`${BaseURL}/induction/allSections`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getInductionItems = async () => {
  const response = await fetch(`${BaseURL}/induction/allItems`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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