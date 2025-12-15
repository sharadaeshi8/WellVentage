"use client";
import React, { useEffect, useState } from "react";
import { leadService } from "@/lib/services";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong";
}

const TABS = ["Basic", "Preferences", "Status"] as const;
type Tab = (typeof TABS)[number];

export default function LeadEditForm({ id }: { id: string | undefined }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idForLoad = id ?? searchParams.get("id") ?? "";
  const [tab, setTab] = useState<Tab>("Basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [basic, setBasic] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    heightUnit: "",
    weightUnit: "",
  });
  const [pref, setPref] = useState({
    activityLevel: "",
    wellnessGoals: [] as string[],
    primaryFitnessFocus: "",
    preferredGymTime: "",
    preferredWorkoutIntensity: "",
    medicalConcerns: [] as string[],
    medicalConcernsOther: "",
    previousGymExperience: "",
  });
  const [status, setStatus] = useState({
    inquiryDate: "",
    assignedTo: "",
    interestLevel: "",
    followUpStatus: "",
    preferredPackage: "",
    preferredPTPackage: "",
    howHeardAboutGym: "",
  });
  const [notes, setNotes] = useState<
    Array<{
      date: string;
      content: string;
      _id?: string;
      createdBy?: string;
      createdAt?: string;
    }>
  >([]);

  // Validation schemas (aligned with LeadCreateForm)
  const BasicSchema = z.object({
    firstName: z.string().min(1, "please enter first name"),
    lastName: z.string().min(1, "please enter last name"),
    phone: z
      .string()
      .min(1, "please enter phone")
      .regex(/^[0-9+\-()\s]{7,20}$/i, "please enter valid phone"),
    email: z
      .string()
      .min(1, "please enter email")
      .email("please enter valid email"),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    heightUnit: z.string().optional(),
    weightUnit: z.string().optional(),
  });
  type BasicErrors = Partial<Record<keyof z.infer<typeof BasicSchema>, string>>;
  const [basicErrors, setBasicErrors] = useState<BasicErrors>({});

  const PreferencesSchema = z
    .object({
      activityLevel: z
        .enum([
          "Sedentary",
          "Lightly active",
          "Moderately active",
          "Very active",
          "",
        ] as const)
        .optional(),
      wellnessGoals: z.array(z.string()).optional(),
      primaryFitnessFocus: z
        .enum([
          "Gym workouts",
          "Yoga",
          "Meditation",
          "Nutrition",
          "Recovery",
          "",
        ] as const)
        .optional(),
      preferredGymTime: z
        .enum(["Morning", "Afternoon", "Evening", "Late evening", ""] as const)
        .optional(),
      preferredWorkoutIntensity: z
        .enum(["Light", "Moderate", "High", ""] as const)
        .optional(),
      medicalConcerns: z.array(z.string()).optional(),
      medicalConcernsOther: z.string().optional(),
      previousGymExperience: z.enum(["yes", "no", ""] as const).optional(),
    })
    .optional();
  // Define the shape of the preferences object
  type PreferencesType = {
    activityLevel?: string;
    wellnessGoals?: string[];
    primaryFitnessFocus?: string;
    preferredGymTime?: string;
    preferredWorkoutIntensity?: string;
    medicalConcerns?: string[];
    medicalConcernsOther?: string;
    previousGymExperience?: string | boolean;
  };

  type PrefErrors = Partial<Record<keyof PreferencesType, string>>;
  const [prefErrors, setPrefErrors] = useState<PrefErrors>({});

  const StatusSchema = z.object({
    inquiryDate: z.string().optional(),
    assignedTo: z.string().optional(),
    interestLevel: z.enum(["Hot", "Warm", "Cold", ""] as const).optional(),
    followUpStatus: z
      .enum([
        "New Inquiry",
        "Needs Follow-Up",
        "Engaged",
        "Converted",
        "Archived",
        "",
      ] as const)
      .optional(),
    preferredPackage: z.string().optional(),
    preferredPTPackage: z.string().optional(),
    howHeardAboutGym: z
      .enum([
        "Social Media",
        "Word of Mouth",
        "Walk-in",
        "WellVantage B2C App",
        "",
      ] as const)
      .optional(),
  });
  type StatusErrors = Partial<
    Record<keyof z.infer<typeof StatusSchema>, string>
  >;
  const [statusErrors, setStatusErrors] = useState<StatusErrors>({});

  // Load existing lead
  useEffect(() => {
    if (!idForLoad) {
      setError("Missing lead id");
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);
    leadService
      .getLead(idForLoad)
      .then((data) => {
        if (!mounted) return;
        // Basic
        setBasic({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          email: data.email || "",
          gender: data.gender || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().slice(0, 10)
            : "",
          height: data.height ? String(data.height) : "",
          weight: data.weight ? String(data.weight) : "",
          heightUnit: data.heightUnit || "cm",
          weightUnit: data.weightUnit || "kg",
        });

        // Notes
        if (Array.isArray(data.notes)) {
          setNotes(
            data.notes.map(
              (note: {
                _id?: string;
                content?: string;
                date?: string | Date;
                createdBy?: any;
                createdAt?: string | Date;
              }) => ({
                _id: note._id,
                content: note.content || "",
                date: note.date
                  ? new Date(note.date).toISOString().slice(0, 10)
                  : "",
                createdBy: note.createdBy,
                createdAt: note.createdAt,
              })
            )
          );
        }
        // Preferences
        const p = data.preferences || {};
        setPref({
          activityLevel: p.activityLevel || "",
          wellnessGoals: Array.isArray(p.wellnessGoals) ? p.wellnessGoals : [],
          primaryFitnessFocus: p.primaryFitnessFocus || "",
          preferredGymTime: p.preferredGymTime || "",
          preferredWorkoutIntensity: p.preferredWorkoutIntensity || "",
          medicalConcerns: Array.isArray(p.medicalConcerns)
            ? p.medicalConcerns
            : [],
          medicalConcernsOther: p.medicalConcernsOther || "",
          previousGymExperience:
            typeof p.previousGymExperience === "boolean"
              ? p.previousGymExperience
                ? "yes"
                : "no"
              : "",
        });
        // Status
        const s = data.status || {};
        setStatus({
          inquiryDate: s.inquiryDate
            ? new Date(s.inquiryDate).toISOString().slice(0, 10)
            : "",
          assignedTo: s.assignedTo?._id || s.assignedTo || "",
          interestLevel: s.interestLevel || "",
          followUpStatus: s.followUpStatus || "",
          preferredPackage: s.preferredPackage || "",
          preferredPTPackage: s.preferredPTPackage || "",
          howHeardAboutGym: s.howHeardAboutGym || "",
        });
      })
      .catch((e: unknown) => {
        setError(getErrorMessage(e) || "Failed to load lead");
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [idForLoad]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Validate all sections before saving
      const b = BasicSchema.safeParse(basic);
      if (!b.success) {
        const errs: BasicErrors = {};
        for (const issue of b.error.issues) {
          const path = issue.path[0];
          if (typeof path === "string" && path in basic) {
            const key = path as keyof typeof basic;
            errs[key] = issue.message;
          }
        }
        setBasicErrors(errs);
        setTab("Basic");
        setSaving(false);
        return;
      }
      setBasicErrors({});
      const pz = PreferencesSchema.safeParse(pref);
      if (!pz.success) {
        const errs: PrefErrors = {};
        for (const issue of pz.error.issues) {
          const path = issue.path[0];
          if (typeof path === "string") {
            // Safely cast to a key of PreferencesType
            const key = path as keyof PreferencesType;
            if (key in pref) {
              errs[key] = issue.message;
            }
          }
        }
        setPrefErrors(errs);
        setTab("Preferences");
        setSaving(false);
        return;
      }
      setPrefErrors({});
      const sz = StatusSchema.safeParse(status);
      if (!sz.success) {
        const errs: StatusErrors = {};
        for (const issue of sz.error.issues) {
          const path = issue.path[0];
          if (typeof path === "string" && path in status) {
            const key = path as keyof typeof status;
            errs[key] = issue.message;
          }
        }
        setStatusErrors(errs);
        setTab("Status");
        setSaving(false);
        return;
      }
      setStatusErrors({});
      // Update basic
      await leadService.updateLead(idForLoad, {
        firstName: basic.firstName,
        lastName: basic.lastName,
        phone: basic.phone,
        email: basic.email,
        gender:
          (basic.gender as "Male" | "Female" | "Non binary/Other" | "") ||
          undefined,
        dateOfBirth: basic.dateOfBirth
          ? new Date(basic.dateOfBirth)
          : undefined,
        height: basic.height ? Number(basic.height) : undefined,
        weight: basic.weight ? Number(basic.weight) : undefined,
        heightUnit: basic.heightUnit,
        weightUnit: basic.weightUnit,
      });

      // Update preferences
      await leadService.updateLead(idForLoad, {
        preferences: {
          activityLevel: pref.activityLevel || undefined,
          wellnessGoals: pref.wellnessGoals?.length
            ? pref.wellnessGoals
            : undefined,
          primaryFitnessFocus: pref.primaryFitnessFocus || undefined,
          preferredGymTime: pref.preferredGymTime || undefined,
          preferredWorkoutIntensity:
            pref.preferredWorkoutIntensity || undefined,
          medicalConcerns: pref.medicalConcerns?.length
            ? pref.medicalConcerns
            : undefined,
          medicalConcernsOther: pref.medicalConcernsOther || undefined,
          previousGymExperience:
            pref.previousGymExperience === ""
              ? undefined
              : pref.previousGymExperience === "yes",
        },
      });

      // Update status
      await leadService.updateLead(idForLoad, {
        status: {
          inquiryDate: status.inquiryDate
            ? new Date(status.inquiryDate)
            : undefined,
          assignedTo: status.assignedTo || undefined,
          interestLevel: status.interestLevel || undefined,
          followUpStatus: status.followUpStatus || undefined,
          preferredPackage: status.preferredPackage || undefined,
          preferredPTPackage: status.preferredPTPackage || undefined,
          howHeardAboutGym: status.howHeardAboutGym || undefined,
        },
      });

      // Update notes
      await leadService.updateLead(idForLoad, {
        notes: notes.map((note) => ({
          content: note.content.trim(),
          ...(note.date && { date: note.date }),
        })),
      });

      router.push("/leads");
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`h-10 px-1 border-b-2 -mb-px cursor-pointer ${
              tab === t
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={save} className="space-y-8">
        {tab === "Basic" && (
          <section className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                First Name*
              </label>
              <input
                className={`w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] ${
                  basicErrors.firstName ? "border-red-500" : "border-[#D9D9D9]"
                }`}
                value={basic.firstName}
                onChange={(e) => {
                  setBasic({ ...basic, firstName: e.target.value });
                  if (basicErrors.firstName) {
                    setBasicErrors((prev) => ({ ...prev, firstName: "" }));
                  }
                }}
                required
              />
              {basicErrors.firstName && (
                <p className="mt-1 text-xs text-red-600">
                  {basicErrors.firstName}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Last Name*
              </label>
              <input
                className={`w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] ${
                  basicErrors.lastName ? "border-red-500" : "border-[#D9D9D9]"
                }`}
                value={basic.lastName}
                onChange={(e) => {
                  setBasic({ ...basic, lastName: e.target.value });
                  if (basicErrors.lastName) {
                    setBasicErrors((prev) => ({ ...prev, lastName: "" }));
                  }
                }}
                required
              />
              {basicErrors.lastName && (
                <p className="mt-1 text-xs text-red-600">
                  {basicErrors.lastName}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Phone*
              </label>
              <input
                className={`w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] ${
                  basicErrors.phone ? "border-red-500" : "border-[#D9D9D9]"
                }`}
                value={basic.phone}
                onChange={(e) => {
                  setBasic({ ...basic, phone: e.target.value });
                  if (basicErrors.phone) {
                    setBasicErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
                required
              />
              {basicErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{basicErrors.phone}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Email*
              </label>
              <input
                className={`w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] ${
                  basicErrors.email ? "border-red-500" : "border-[#D9D9D9]"
                }`}
                type="email"
                value={basic.email}
                onChange={(e) => {
                  setBasic({ ...basic, email: e.target.value });
                  if (basicErrors.email) {
                    setBasicErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                required
              />
              {basicErrors.email && (
                <p className="mt-1 text-xs text-red-600">{basicErrors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Gender
              </label>
              <select
                className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] border-[#D9D9D9]"
                value={basic.gender}
                onChange={(e) =>
                  setBasic({ ...basic, gender: e.target.value as any })
                }
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non binary/Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Date of Birth
              </label>
              <input
                className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] border-[#D9D9D9] text-[#737373]"
                type="date"
                value={basic.dateOfBirth}
                onChange={(e) =>
                  setBasic({ ...basic, dateOfBirth: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Height
              </label>
              <div className="flex gap-2">
                <input
                  className={`w-full h-10 px-3 border rounded-[8px] border-[#D9D9D9] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]`}
                  value={basic.height}
                  onChange={(e) =>
                    setBasic({ ...basic, height: e.target.value })
                  }
                />
                <select
                  className="h-10 px-3 border rounded-[8px] bg-[#ECFDF5] text-green-600 font-medium shadow-[0px_0px_2px_2px_#D9D9D9]"
                  value={basic.heightUnit}
                  onChange={(e) =>
                    setBasic({
                      ...basic,
                      heightUnit: e.target.value as "cm" | "ft",
                    })
                  }
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Weight
              </label>
              <div className="flex gap-2">
                <input
                  className={`w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] border-[#D9D9D9] text-[#737373]`}
                  value={basic.weight}
                  onChange={(e) =>
                    setBasic({ ...basic, weight: e.target.value })
                  }
                />
                <select
                  className="h-10 px-3 border rounded-[8px] bg-[#ECFDF5] text-green-600 font-medium shadow-[0px_0px_2px_2px_#D9D9D9]"
                  value={basic.weightUnit}
                  onChange={(e) =>
                    setBasic({
                      ...basic,
                      weightUnit: e.target.value as "kg" | "g",
                    })
                  }
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {tab === "Preferences" && (
          <section className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Activity Level
              </label>
              <select
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]"
                value={pref.activityLevel}
                onChange={(e) =>
                  setPref({ ...pref, activityLevel: e.target.value as any })
                }
              >
                <option value="">Select</option>
                <option>Sedentary</option>
                <option>Lightly active</option>
                <option>Moderately active</option>
                <option>Very active</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Wellness Goals
              </label>
              <select
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]"
                value={pref.wellnessGoals?.[0] || ""}
                onChange={(e) =>
                  setPref({
                    ...pref,
                    wellnessGoals: e.target.value ? [e.target.value] : [],
                  })
                }
              >
                <option value="">Select</option>
                <option>Lose weight</option>
                <option>Gain weight</option>
                <option>Build muscle</option>
                <option>Modify My Diet</option>
                <option>Manage Stress</option>
                <option>Improve Step Count</option>
                <option>General wellness</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Primary Fitness Focus
              </label>
              <select
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]"
                value={pref.primaryFitnessFocus}
                onChange={(e) =>
                  setPref({ ...pref, primaryFitnessFocus: e.target.value })
                }
              >
                <option value="">Select</option>
                <option>Gym workouts</option>
                <option>Yoga</option>
                <option>Meditation</option>
                <option>Nutrition</option>
                <option>Recovery</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Preferred Gym Time
              </label>
              <select
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]"
                value={pref.preferredGymTime}
                onChange={(e) =>
                  setPref({ ...pref, preferredGymTime: e.target.value })
                }
              >
                <option value="">Select</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Late evening</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Preferred Workout Intensity
              </label>
              <select
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]"
                value={pref.preferredWorkoutIntensity}
                onChange={(e) =>
                  setPref({
                    ...pref,
                    preferredWorkoutIntensity: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option>Light</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Medical Concerns
              </label>
              <select
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]"
                value={pref.medicalConcerns?.[0] || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "None") {
                    setPref({
                      ...pref,
                      medicalConcerns: ["None"],
                      medicalConcernsOther: "",
                    });
                  } else {
                    setPref({ ...pref, medicalConcerns: value ? [value] : [] });
                  }
                }}
              >
                <option value="">Select</option>
                <option>Diabetes</option>
                <option>Hypertension</option>
                <option>Asthma</option>
                <option>Others</option>
                <option>None</option>
              </select>
              {pref.medicalConcerns?.includes("Others") && (
                <input
                  className={`w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]`}
                  placeholder="Please specify other medical concerns"
                  value={pref.medicalConcernsOther}
                  onChange={(e) =>
                    setPref({ ...pref, medicalConcernsOther: e.target.value })
                  }
                />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Previous Gym Experience
              </label>
              <select
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]"
                value={pref.previousGymExperience}
                onChange={(e) =>
                  setPref({ ...pref, previousGymExperience: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </div>
          </section>
        )}

        {tab === "Status" && (
          <section className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Inquiry Date
              </label>
              <input
                className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] border-[#D9D9D9]"
                type="date"
                value={status.inquiryDate}
                onChange={(e) =>
                  setStatus({ ...status, inquiryDate: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Assigned To (User ID)
              </label>
              <input
                className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] border-[#D9D9D9]"
                placeholder="User ID"
                value={status.assignedTo}
                onChange={(e) =>
                  setStatus({ ...status, assignedTo: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Interest Level
              </label>
              <select
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]"
                value={status.interestLevel}
                onChange={(e) =>
                  setStatus({ ...status, interestLevel: e.target.value })
                }
              >
                <option value="">Select</option>
                <option>Hot</option>
                <option>Warm</option>
                <option>Cold</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Follow Up Status
              </label>
              <select
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]"
                value={status.followUpStatus}
                onChange={(e) =>
                  setStatus({ ...status, followUpStatus: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="New Inquiry">New Inquiry</option>
                <option value="Needs Follow-Up">Needs Follow-Up</option>
                <option value="Engaged">Engaged</option>
                <option value="Converted">Converted</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Preferred Package
              </label>
              <input
                className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] border-[#D9D9D9]"
                value={status.preferredPackage}
                onChange={(e) =>
                  setStatus({ ...status, preferredPackage: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Preferred PT Package
              </label>
              <input
                className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] border-[#D9D9D9]"
                value={status.preferredPTPackage}
                onChange={(e) =>
                  setStatus({ ...status, preferredPTPackage: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                How Heard About Gym
              </label>
              <select
                className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373] border-[#D9D9D9]"
                value={status.howHeardAboutGym}
                onChange={(e) =>
                  setStatus({ ...status, howHeardAboutGym: e.target.value })
                }
              >
                <option value="">Select</option>
                <option>Social Media</option>
                <option>Word of Mouth</option>
                <option>Walk-in</option>
                <option>WellVantage B2C App</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-[#737373] font-medium">
                  Custom notes
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Add note"
                    onClick={() =>
                      setNotes((prev) => [...prev, { date: "", content: "" }])
                    }
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                  >
                    <span>+</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {notes.map((n, idx) => (
                  <div
                    key={idx}
                    className="grid lg:grid-cols-[400px_1fr_40px] gap-3 items-center w-full"
                  >
                    <input
                      type="date"
                      className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] border-[#D9D9D9] text-[#737373]"
                      value={n.date}
                      onChange={(e) => {
                        const v = e.target.value;
                        setNotes((prev) =>
                          prev.map((x, i) =>
                            i === idx ? { ...x, date: v } : x
                          )
                        );
                      }}
                    />
                    <input
                      className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] border-[#D9D9D9] text-[#737373]"
                      placeholder="Write a note"
                      value={n.content}
                      onChange={(e) => {
                        const v = e.target.value;
                        setNotes((prev) =>
                          prev.map((x, i) =>
                            i === idx ? { ...x, content: v } : x
                          )
                        );
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newNotes = notes.filter((_, i) => i !== idx);
                        setNotes(newNotes);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                      title="Delete note"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="pt-2">
          <button
            disabled={saving}
            className="h-10 px-8 bg-green-500 text-white rounded"
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
