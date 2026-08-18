import { useEffect, useMemo, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Plus, Trash2, ChevronRight, X, CheckCheck, Pen, CircleQuestionMark } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Hashids from "hashids";
import type { JobData } from "../../types/jobData";
import type { InterviewQuestion, QuestionFormData } from "../../types/Interview";
import Modal from "../../components/modal";
import { getJobById } from "../../utils/JobRequests";
import { GetAllQuestions, UpdateQuestion, CreateInterview, DeleteQuestion } from "../../api/InterviewApi";

type ModalType = "delete" | null;

const InterviewQuestionsPageLocal = () => {
  const params = useParams();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<InterviewQuestion | null>(null);
  const [job, setJob] = useState<JobData>();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);
  const hashIds = new Hashids('LatticeHumanResourceEncode', 10);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuestionFormData>({
    defaultValues: {
      displayOrder: 0,
    },
  });

  const jobParamId = useMemo(() => {
    return hashIds.decode(String(params.jobId))[0];
  }, [params.id]);

  const jobId = Number(jobParamId)

  useEffect(() => {
    if (jobId) {
      console.log("jobid", jobId)
      try {
        setLoading(true)
        getQuestions()
        fetchJobDetails();
      } catch {
        console.error("Could not get page details");
      } finally {
        setLoading(false)
      }
    }
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      const response = await getJobById(jobId);

      const data = await response.json()
      console.log("job", data)
      if (response.status === 200) {
        setJob(data.data);
      }
    } catch {
      console.error("Could not get fetch details");
    }
  };

  const getQuestions = async () => {
    try {
      const questions = await GetAllQuestions(jobId)

      if (!questions) {
        return
      }
      setQuestions(questions)
    } catch {

    }
  }

  const onSubmit = async (data: QuestionFormData) => {
    try {
      if (editingQuestion) {
        const formData = new FormData()

        formData.append("InterviewQuestionId", Number(editingQuestion.interviewQuestionId).toString());
        formData.append("QuestionText", data.question);
        formData.append("QuestionHint", String(data.hint));
        const orderValue =
          data.displayOrder !== undefined && data.displayOrder !== null
            ? data.displayOrder
            : questions.length + 1;

        formData.append("Order", orderValue.toString());

        const formDataObject = Object.fromEntries(formData.entries());
        console.log("Form Data:", formDataObject);


        const interviewResponse = await UpdateQuestion(formData)
        console.log("inter", interviewResponse)
        if (interviewResponse.status !== 200) {
          toast.error("Failed to update question")
          return
        } else {
          toast.success("Question Updated Successfully")
        }
      } else {

        const formData = new FormData()

        formData.append("JobId", jobId.toString());
        formData.append("QuestionText", data.question);
        formData.append("QuestionHint", String(data.hint || "N/A"));
        formData.append("Order", String(data.displayOrder || questions.length + 1));

        const interviewResponse = await CreateInterview(formData)
        console.log("inter", interviewResponse)
        if (interviewResponse.status !== 200) {
          toast.error("Failed to add question")
          return
        }

        toast.success("Question created successfully!");
      }

      cancelEdit();
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("An error occurred while saving the question");
    } finally {
      await getQuestions()
    }
  };

  const handleEdit = (question: InterviewQuestion, questionId: number) => {
    setEditingQuestion(question);
    setShowForm(true);
    setQuestionId(questionId)
    reset({
      question: question.questionText,
      hint: question.questionHint || "",
      displayOrder: question.order,
    });
  };

  const handleDelete = async () => {
    try {
      const deleteQuestion = await DeleteQuestion(Number(questionId))

      if (deleteQuestion.status !== 200) {
        toast.error("Failed to delete question")
        return
      }

      toast.success("Question deleted successfully!");
    } catch {
      toast.error("Failed to delete question")
    } finally {
      await getQuestions()
      closeModal()
    }
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
    setShowForm(false);
    reset({
      displayOrder: 0,
    });
  };

  const openDeletModal = (questionId: number) => {
    setModalType("delete");
    setQuestionId(questionId);
  };

  const closeModal = () => {
    setModalType(null);
    setQuestionId(null);
  };

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  return (
    <div className="app-content-wrap">
      <ToastContainer />

      <Modal
        isOpen={modalType === "delete"}
        title="Delete Question"
        message="Are you sure you want to delete this question"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        buttonIcon={<Trash2 size={16} />}
        headerIcon={<CircleQuestionMark size={20} />}
        loading={loading}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
      <div className="container-fluid">
        {/* Page Header */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <div>
                <h1 className="page-title fs-18 lh-1 mb-2">Self Interview Questions</h1>
                <p className="text-muted mb-0">Job: {job?.jobTitle}</p>
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">

                  <li className="breadcrumb-item active">Self Interview Questions</li>
                  <li className="mb-2">
                    <ChevronRight size={15} />
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    <NavLink to={`/JobMgt/${params.jobId}/${params.clientId}`}>
                      Job Details
                    </NavLink>
                  </li>
                  <li className="mb-2">
                    <ChevronRight size={15} />
                  </li>
                  <li className="active breadcrumb-item" aria-current="page">
                    <NavLink to="/JobMgt">
                      Job Management
                    </NavLink>
                  </li>
                  <li className="mb-2">
                    <ChevronRight size={15} />
                  </li>
                  <li className="breadcrumb-item">
                    <NavLink to="/Dashboard">
                      Dashboard
                    </NavLink>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-success"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus size={18} className="me-1" />
                {showForm ? "Hide Form" : "Add Question"}
              </button>
              {/* <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/jobDetails/${hashIds.encode(String(jobId))}`)}
              >
                Back to Job
              </button> */}
            </div>
          </div>
        </div>

        {/* Question Form */}
        {showForm && (
          <div className="row mb-3">
            <div className="col-12">
              <div className="card">
                <div className="card-header mb-5">
                  <h5 className="mb-0">
                    {editingQuestion ? "Edit Question" : "Add New Question"}
                  </h5>
                </div>
                <div className="card-body mt-10" style={{ marginTop: "20px" }}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                      {/* Question Text */}
                      <div className="col-12">
                        <label className="form-label">
                          Question <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.question ? "is-invalid" : ""}`}
                          rows={3}
                          placeholder="Enter your question..."
                          {...register("question", {
                            required: "Question is required",
                            maxLength: {
                              value: 500,
                              message: "Question cannot exceed 500 characters",
                            },
                          })}
                        />
                        {errors.question && (
                          <div className="invalid-feedback">{errors.question.message}</div>
                        )}
                      </div>

                      {/* Hint/Description */}
                      <div className="col-12">
                        <label className="form-label">Hint / Description (Optional)</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="Add a hint or description to help the candidate understand the question..."
                          {...register("hint", {
                            maxLength: {
                              value: 500,
                              message: "Hint cannot exceed 500 characters",
                            },
                          })}
                        />
                        <small className="text-muted">
                          Provide additional context or guidance for the candidate
                        </small>
                      </div>

                      {/* Display Order */}
                      <div className="col-md-6">
                        <label className="form-label">Display Order</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0 for auto"
                          {...register("displayOrder", { valueAsNumber: true })}
                        />
                        <small className="text-muted">Leave as 0 to add at the end</small>
                      </div>

                      {/* Form Actions */}
                      <div className="col-12">
                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-success">
                            <CheckCheck size={16} className="me-1" />
                            {editingQuestion ? "Update" : "Save"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-dark"
                            onClick={cancelEdit}
                          >
                            <X size={16} className="me-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header ">
                <h5 className="mb-0">Questions ({questions.length})</h5>
              </div>
              <div className="card-body mt-15">
                {questions.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-3">No questions yet</p>
                    <button
                      className="btn btn-success"
                      onClick={() => setShowForm(true)}
                    >
                      <Plus size={18} className="me-1" />
                      Add Your First Question
                    </button>
                  </div>
                ) : (
                  <div className="list-group">
                    {sortedQuestions.map((question, index) => (
                      <div
                        key={question.interviewQuestionId}
                        className="list-group-item"
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">
                              {index + 1}. {question.questionText}
                            </h6>
                            {question.questionHint && (
                              <p className="text-muted small mb-1 mt-1">
                                <span className="fw-semibold">Hint:</span> {question.questionHint}
                              </p>
                            )}
                            <small className="text-muted">
                              Display Order: {question.order}
                            </small>
                          </div>
                          <div className="d-flex gap-1 ms-3">
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleEdit(question, question.interviewQuestionId)}
                              title="Edit"
                            >
                              <Pen size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => openDeletModal(question.interviewQuestionId)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionsPageLocal;