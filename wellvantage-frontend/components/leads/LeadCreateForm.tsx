"use client";
import React, { useState } from "react";
import { leadService } from "@/lib/services";
import { useRouter } from "next/navigation";
import { z } from "zod";

type Basic = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender?: "Male" | "Female" | "Non binary/Other" | "";
  dateOfBirth?: string;
  height?: string;
  weight?: string;
  heightUnit?: "cm" | "ft";
  weightUnit?: "kg" | "g";
};

type Preferences = {
  activityLevel?:
    | "Sedentary"
    | "Lightly active"
    | "Moderately active"
    | "Very active"
    | "";
  wellnessGoals?: string[];
  primaryFitnessFocus?:
    | "Gym workouts"
    | "Yoga"
    | "Meditation"
    | "Nutrition"
    | "Recovery"
    | "";
  preferredGymTime?: "Morning" | "Afternoon" | "Evening" | "Late evening" | "";
  preferredWorkoutIntensity?: "Light" | "Moderate" | "High" | "";
  medicalConcerns?: string[];
  medicalConcernsOther?: string;
  previousGymExperience?: boolean | "";
};

type Status = {
  inquiryDate?: string;
  assignedTo?: string;
  interestLevel?: "Hot" | "Warm" | "Cold" | "";
  followUpStatus?:
    | "New Inquiry"
    | "Needs Follow-Up"
    | "Engaged"
    | "Converted"
    | "Archived"
    | "";
  preferredPackage?: string;
  preferredPTPackage?: string;
  howHeardAboutGym?:
    | "Social Media"
    | "Word of Mouth"
    | "Walk-in"
    | "WellVantage B2C App"
    | "";
};

const tabs = ["Basic", "Preferences", "Status"] as const;

type Tab = (typeof tabs)[number];

export default function LeadCreateForm() {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("Basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [basic, setBasic] = useState<Basic>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    height: "",
    heightUnit: "cm" as "cm" | "ft",
    weight: "",
    weightUnit: "kg" as "kg" | "g",
  });

  const [pref, setPref] = useState<Preferences>({
    activityLevel: "",
    wellnessGoals: [],
    primaryFitnessFocus: "",
    preferredGymTime: "",
    preferredWorkoutIntensity: "",
    medicalConcerns: [],
    medicalConcernsOther: "",
    previousGymExperience: "",
  });

  const [status, setStatus] = useState<Status>({
    inquiryDate: "",
    assignedTo: "",
    interestLevel: "",
    followUpStatus: "",
    preferredPackage: "",
    preferredPTPackage: "",
    howHeardAboutGym: "",
  });
  // Align with the backend's LeadNote type
  interface LeadNote {
    _id?: string;
    text: string; // The backend expects 'text' instead of 'content'
    createdBy?: string;
    createdAt?: string;
    date?: string; // Keep for UI, but not part of the backend model
  }

  const [notes, setNotes] = useState<LeadNote[]>([]);

  // Validation: Basic tab
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
  });
  type BasicErrors = Partial<Record<keyof z.infer<typeof BasicSchema>, string>>;
  const [basicErrors, setBasicErrors] = useState<BasicErrors>({});

  // Validation: Preferences tab - All fields are optional
  const PreferencesSchema = z.object({
    activityLevel: z.string().optional(),
    wellnessGoals: z.array(z.string()).optional(),
    primaryFitnessFocus: z.string().optional(),
    preferredGymTime: z.string().optional(),
    preferredWorkoutIntensity: z.string().optional(),
    medicalConcerns: z.array(z.string()).optional(),
    medicalConcernsOther: z.string().optional(),
    previousGymExperience: z.union([z.boolean(), z.string()]).optional(),
  });
  type PrefErrors = Partial<
    Record<keyof z.infer<typeof PreferencesSchema>, string>
  >;
  const [prefErrors, setPrefErrors] = useState<PrefErrors>({});

  // Validation: Status tab
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

  // Tab navigation helpers
  const currentIndex = tabs.indexOf(active);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === tabs.length - 1;
  const goPrev = () => {
    if (!isFirst) setActive(tabs[currentIndex - 1]);
  };
  const goNext = () => {
    // Validate Basic tab before moving forward
    if (active === "Basic") {
      const parsed = BasicSchema.safeParse(basic);
      if (!parsed.success) {
        const errs: BasicErrors = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as keyof BasicErrors;
          if (!errs[key]) errs[key] = issue.message;
        }
        setBasicErrors(errs);
        return; // stay on Basic
      }
      setBasicErrors({});
    }
    if (active === "Preferences") {
      const parsed = PreferencesSchema.safeParse(pref);
      if (!parsed.success) {
        const errs: PrefErrors = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as keyof PrefErrors;
          if (!errs[key]) errs[key] = issue.message;
        }
        setPrefErrors(errs);
        return; // stay on Preferences
      }
      setPrefErrors({});
    }
    if (!isLast) setActive(tabs[currentIndex + 1]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Validate all tabs before submission
    const parsed = BasicSchema.safeParse(basic);
    if (!parsed.success) {
      const errs: BasicErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BasicErrors;
        if (!errs[key]) errs[key] = issue.message;
      }
      setBasicErrors(errs);
      setActive("Basic");
      return;
    }
    setBasicErrors({});
    const prefParsed = PreferencesSchema.safeParse(pref);
    if (!prefParsed.success) {
      const errs: PrefErrors = {};
      for (const issue of prefParsed.error.issues) {
        const key = issue.path[0] as keyof PrefErrors;
        if (!errs[key]) errs[key] = issue.message;
      }
      console.log("Setting Preferences errors:", errs);
      setPrefErrors(errs);
      setActive("Preferences");
      return;
    }
    setPrefErrors({});
    const statusParsed = StatusSchema.safeParse(status);
    if (!statusParsed.success) {
      console.log("Status validation failed:", statusParsed.error.issues);
      const errs: StatusErrors = {};
      for (const issue of statusParsed.error.issues) {
        const key = issue.path[0] as keyof StatusErrors;
        if (!errs[key]) errs[key] = issue.message;
      }
      setStatusErrors(errs);
      setActive("Status");
      return;
    }
    setStatusErrors({});
    setLoading(true);
    try {
      // Prepare the complete payload with all data including notes
      const createPayload: any = {
        // Basic info
        firstName: basic.firstName,
        lastName: basic.lastName,
        phone: basic.phone,
        email: basic.email,
        gender: basic.gender || undefined,
        dateOfBirth: basic.dateOfBirth
          ? new Date(basic.dateOfBirth)
          : undefined,
        height: basic.height ? Number(basic.height) : undefined,
        weight: basic.weight ? Number(basic.weight) : undefined,
        heightUnit: basic.heightUnit,
        weightUnit: basic.weightUnit,

        // Preferences
        preferences: {
          ...(pref.activityLevel && { activityLevel: pref.activityLevel }),
          ...(pref.wellnessGoals?.length && {
            wellnessGoals: pref.wellnessGoals,
          }),
          ...(pref.primaryFitnessFocus && {
            primaryFitnessFocus: pref.primaryFitnessFocus,
          }),
          ...(pref.preferredGymTime && {
            preferredGymTime: pref.preferredGymTime,
          }),
          ...(pref.preferredWorkoutIntensity && {
            preferredWorkoutIntensity: pref.preferredWorkoutIntensity,
          }),
          ...(pref.medicalConcerns?.length && {
            medicalConcerns: pref.medicalConcerns,
          }),
          ...(pref.medicalConcernsOther && {
            medicalConcernsOther: pref.medicalConcernsOther,
          }),
          ...(pref.previousGymExperience !== "" && {
            previousGymExperience: Boolean(pref.previousGymExperience),
          }),
        },

        // Status
        status: {
          ...(status.inquiryDate && {
            inquiryDate: new Date(status.inquiryDate),
          }),
          ...(status.assignedTo && { assignedTo: status.assignedTo }),
          ...(status.interestLevel && { interestLevel: status.interestLevel }),
          ...(status.followUpStatus && {
            followUpStatus: status.followUpStatus,
          }),
          ...(status.preferredPackage && {
            preferredPackage: status.preferredPackage,
          }),
          ...(status.preferredPTPackage && {
            preferredPTPackage: status.preferredPTPackage,
          }),
          ...(status.howHeardAboutGym && {
            howHeardAboutGym: status.howHeardAboutGym,
          }),
        },

        // Notes (only include non-empty notes)
        notes: notes
          .filter((note) => note.text.trim())
          .map((note) => ({
            content: note.text.trim(),
            ...(note.date && { date: note.date }),
          })),
      };

      // Send the complete payload in a single API call
      await leadService.createLead(createPayload);

      // 5) Redirect to leads page on success
      router.push("/leads");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to create lead"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 border-b">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className={`h-10 px-1 border-b-2 -mb-px cursor-pointer ${
              active === t
                ? "border-[#28A745] text-[#28A745]"
                : "border-transparent text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-8">
        {active === "Basic" && (
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
                  className={`w-full h-10 px-3 border  border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]`}
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
                  className={`w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] text-[#737373]`}
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

        {active === "Preferences" && (
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
                  setPref({
                    ...pref,
                    primaryFitnessFocus: e.target.value as any,
                  })
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
                  setPref({ ...pref, preferredGymTime: e.target.value as any })
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
                    preferredWorkoutIntensity: e.target.value as any,
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
                value={
                  pref.previousGymExperience === ""
                    ? ""
                    : pref.previousGymExperience
                    ? "yes"
                    : "no"
                }
                onChange={(e) =>
                  setPref({
                    ...pref,
                    previousGymExperience:
                      e.target.value === "" ? "" : e.target.value === "yes",
                  })
                }
              >
                <option value="">Select</option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </div>
          </section>
        )}

        {active === "Status" && (
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
                  setStatus({ ...status, interestLevel: e.target.value as any })
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
                  setStatus({
                    ...status,
                    followUpStatus: e.target.value as any,
                  })
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
                  setStatus({
                    ...status,
                    howHeardAboutGym: e.target.value as any,
                  })
                }
              >
                <option value="">Select</option>
                <option>Social Media</option>
                <option>Word of Mouth</option>
                <option>Walk-in</option>
                <option>WellVantage B2C App</option>
              </select>
            </div>

            {/* Custom Notes */}
            <div className=" col-span-1 md:col-span-2 pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Custom Notes
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNotes((prev) => [
                        ...prev,
                        {
                          text: "",
                          date: "",
                        },
                      ]);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                  >
                    <span>+</span>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  {notes.map((note, idx) => (
                    <div
                      key={note._id || idx}
                      className="grid lg:grid-cols-[400px_1fr_40px] gap-3 items-center w-full"
                    >
                      <input
                        type="date"
                        className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] border-[#D9D9D9] text-[#737373]"
                        value={note.date || ""}
                        onChange={(e) => {
                          const newNotes = [...notes];
                          newNotes[idx] = {
                            ...newNotes[idx],
                            date: e.target.value,
                          };
                          setNotes(newNotes);
                        }}
                      />
                      <input
                        className="w-full h-10 px-3 border rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9] border-[#D9D9D9] text-[#737373]"
                        placeholder="Write your note here..."
                        value={note.text || ""}
                        onChange={(e) => {
                          const newNotes = [...notes];
                          newNotes[idx] = {
                            ...newNotes[idx],
                            text: e.target.value,
                          };
                          setNotes(newNotes);
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
            </div>
          </section>
        )}

        <div className="pt-2 flex items-center gap-3">
          {!isFirst && (
            <button
              type="button"
              onClick={goPrev}
              className="h-10 px-6 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 cursor-pointer"
            >
              Previous
            </button>
          )}
          {!isLast && (
            <button
              type="button"
              onClick={goNext}
              className="h-10 px-6 bg-[#28A745] text-white rounded-lg hover:bg-green-600 cursor-pointer"
            >
              Next
            </button>
          )}
          {isLast && (
            <button
              disabled={loading}
              className=" h-10 px-8 bg-[#28A745] text-white rounded cursor-pointer"
            >
              {loading ? "Saving..." : "Create"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
