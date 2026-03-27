import type { JobOfferDiscussion, SendDiscussionMessageRequest } from "../types/JobOffer";

// const BaseURL = import.meta.env.VITE_API_URL;
const BaseURL = "http://localhost:5127";
const token = localStorage.getItem("token");

export const GetDiscussions = async (jobOfferId: number): Promise<JobOfferDiscussion[]> => {
  const response = await fetch(`${BaseURL}/negotiation/${jobOfferId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) throw new Error(`Failed to fetch discussions: ${response.statusText}`);

  return response.json() as Promise<JobOfferDiscussion[]>;
};

export const SendDiscussionMessage = async (
  payload: SendDiscussionMessageRequest, clientId: number
): Promise<JobOfferDiscussion> => {
  const response = await fetch(`${BaseURL}/negotiation/${clientId}/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Failed to send message: ${response.statusText}`);

  return response.json() as Promise<JobOfferDiscussion>;
};

export const UpdateProposalStatus = async (
  proposalId: number,
  status: "Accepted" | "Rejected"
): Promise<void> => {
  const response = await fetch(`${BaseURL}/negotiation/proposals/${proposalId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error(`Failed to update proposal: ${response.statusText}`);
};