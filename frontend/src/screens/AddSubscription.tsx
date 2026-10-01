import { useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen, Subscription, getStoredUser } from "../App";
import { subscriptionSchema, SubscriptionFormValues, CATEGORY_VALUES, PERIOD_VALUES } from "../schemas/subscription";
import { createSub, ApiError } from "../lib/api";
import { subsQueryKey } from "../lib/queryClient";

interface Props {
  navigate: (s: Screen) => void;
}

const SERVICES = [
  { name: "Netflix", icon: "🎬", color: "#e50914", category: "Streaming" },
  { name: "Spotify", icon: "🎵", color: "#1db954", category: "Música" },
  { name: "Disney+", icon: "✨", color: "#0063e5", category: "Streaming" },
  { name: "HBO Max", icon: "📺", color: "#5822a4", category: "Streaming" },
  { name: "Adobe Creative", icon: "🎨", color: "#ff0000", category: "Trabalho" },
  { name: "GitHub Pro", icon: "💻", color: "#6e5494", category: "Trabalho" },
  { name: "Academia", icon: "💪", color: "#f59e0b", category: "Fitness" },
  { name: "PlayStation+", icon: "🎮", color: "#003087", category: "Jogos" },
  { name: "Outro", icon: "📦", color: "#64748b", category: "Outros" },
] as const;

const PAYMENTS = ["Cartão de crédito", "Débito automático", "Pix", "Boleto"];

type Service = (typeof SERVICES)[number];

export default function AddSubscription({ navigate }: Props) {
  const [step, setStep] = useState<"service" | "details">("service");
  const [selected, setSelected] = useState<Service | null>(null);
  const queryClient = useQueryClient();
  const user = getStoredUser();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      period: "Mensal",
      nextCharge: new Date().toISOString().slice(0, 10),
      paymentMethod: PAYMENTS[0],
      category: "Streaming",
    },
  });

  const period = watch("period");
  const category = watch("category");

  const handleSelectService = (s: Service) => {
    setSelected(s);
    setValue("category", s.category as SubscriptionFormValues["category"]);
    setStep("details");
  };

  const saveMutation = useMutation({
    mutationFn: (values: SubscriptionFormValues) => {
      if (!selected || !user) throw new ApiError("Sessão expirada. Faça login novamente.");
      const payload: Omit<Subscription, "id"> = {
        userId: user.id,
        name: selected.name,
        category: values.category,
        value: values.value,
        period: values.period,
        nextCharge: values.nextCharge,
        paymentMethod: values.paymentMethod,
        status: "Ativa",
        color: selected.color,
        icon: selected.icon,
        history: [],
      };
      return createSub(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subsQueryKey(user?.id) });
      navigate("dashboard");
    },
  });

  const onSubmit = (values: SubscriptionFormValues) => saveMutation.mutate(values);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="pt-14 px-6 pb-5 flex items-center gap-4">
        <button
          onClick={() => (step === "details" ? setStep("service") : navigate("dashboard"))}
          className="w-9 h-9 rounded-sm bg-secondary border-none cursor-pointer flex items-center justify-center text-lg text-foreground"
        >
          ←
        </button>
        <div>
          <h1 className="font-heading font-bold text-[22px]">
            {step === "service" ? "Escolher serviço" : "Detalhes"}
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            {step === "service" ? "Passo 1 de 2" : "Passo 2 de 2"}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 pb-6">
        <div className="h-[3px] bg-border rounded-[4px]">
          <div
            className={`h-full rounded-[4px] bg-primary transition-[width] duration-300 ease-in-out ${
              step === "service" ? "w-1/2" : "w-full"
            }`}
          />
        </div>
      </div>

      {step === "service" && (
        <div className="px-6">
          <p className="text-sm text-muted-foreground font-body mb-4">
            Selecione o serviço que deseja adicionar
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {SERVICES.map((s) => (
              <button
                key={s.name}
                onClick={() => handleSelectService(s)}
                className="bg-card border border-border rounded-md py-5 px-2 flex flex-col items-center gap-2 cursor-pointer transition-colors duration-150"
              >
                <div
                  className="w-11 h-11 rounded-sm flex items-center justify-center text-[22px]"
                  style={{ background: `${s.color}22` }}
                >
                  {s.icon}
                </div>
                <span className="text-[11px] font-body text-foreground text-center">{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "details" && selected && (
        <form className="px-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Selected service preview */}
          <div className="flex items-center gap-[14px] bg-card rounded-md py-4 px-4 mb-6 border border-border">
            <div
              className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px]"
              style={{ background: `${selected.color}22` }}
            >
              {selected.icon}
            </div>
            <div>
              <p className="font-heading font-semibold text-[17px]">{selected.name}</p>
              <p className="text-xs text-muted-foreground font-body">{selected.category}</p>
            </div>
          </div>

          <div className="flex flex-col gap-[18px]">
            {/* Value */}
            <Field label="Valor da assinatura" error={errors.value?.message}>
              <div className="relative">
                <span className="absolute left-[14px] top-1/2 -translate-y-1/2 font-heading font-semibold text-base text-primary">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  className="w-full box-border bg-card border border-border rounded-sm py-[14px] pr-[14px] pl-11 font-heading font-semibold text-lg text-foreground outline-none"
                  {...register("value")}
                />
              </div>
            </Field>

            {/* Period */}
            <Field label="Periodicidade" error={errors.period?.message}>
              <div className="flex gap-2">
                {PERIOD_VALUES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setValue("period", p, { shouldValidate: true })}
                    className={`flex-1 py-3 px-1 rounded-sm border-none font-body font-medium text-[13px] cursor-pointer transition-colors ${
                      period === p ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>

            {/* Next charge */}
            <Field label="Próxima cobrança" error={errors.nextCharge?.message}>
              <input
                type="date"
                className="w-full box-border bg-card border border-border rounded-sm p-[14px] font-body text-sm text-foreground outline-none [color-scheme:dark]"
                {...register("nextCharge")}
              />
            </Field>

            {/* Category */}
            <Field label="Categoria" error={errors.category?.message}>
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_VALUES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setValue("category", c, { shouldValidate: true })}
                    className={`py-2 px-[14px] rounded-lg border font-body text-[13px] cursor-pointer transition-colors ${
                      category === c
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-transparent text-muted-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>

            {/* Payment */}
            <Field label="Forma de pagamento" error={errors.paymentMethod?.message}>
              <select
                className="w-full bg-card border border-border rounded-sm p-[14px] font-body text-sm text-foreground outline-none [color-scheme:dark] appearance-none cursor-pointer"
                {...register("paymentMethod")}
              >
                {PAYMENTS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>

            {saveMutation.isError && (
              <p className="text-red-500 text-[13px] font-body">
                {saveMutation.error instanceof ApiError
                  ? saveMutation.error.message
                  : "Não foi possível salvar. Tente novamente."}
              </p>
            )}

            {/* Save */}
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full p-4 rounded-md border-none font-heading font-bold text-base transition-colors mb-6 bg-primary text-primary-foreground cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              {saveMutation.isPending ? "Salvando..." : "Salvar assinatura"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-[13px] text-muted-foreground font-body mb-2">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs font-body mt-1">{error}</p>}
    </div>
  );
}
