import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Subscription, Screen, getStoredUser } from "../App";
import { subscriptionSchema, SubscriptionFormValues, CATEGORY_VALUES, PERIOD_VALUES } from "../schemas/subscription";
import { updateSub, ApiError } from "../lib/api";
import { subsQueryKey } from "../lib/queryClient";

interface Props {
  sub: Subscription;
  navigate: (s: Screen, id?: string | number) => void;
}

const PAYMENTS = ["Cartão de crédito", "Débito automático", "Pix", "Boleto"];

export default function EditSubscription({ sub, navigate }: Props) {
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
      category: sub.category,
      value: sub.value,
      period: sub.period,
      nextCharge: sub.nextCharge,
      paymentMethod: sub.paymentMethod,
    },
  });

  const period = watch("period");
  const category = watch("category");

  const saveMutation = useMutation({
    mutationFn: (values: SubscriptionFormValues) => updateSub(sub.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subsQueryKey(user?.id) });
      navigate("details", sub.id);
    },
  });

  const onSubmit = (values: SubscriptionFormValues) => saveMutation.mutate(values);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="pt-14 px-6 pb-5 flex items-center gap-4">
        <button
          onClick={() => navigate("details", sub.id)}
          className="w-9 h-9 rounded-sm bg-secondary border-none cursor-pointer flex items-center justify-center text-lg text-foreground"
        >
          ←
        </button>
        <div>
          <h1 className="font-heading font-bold text-[22px]">Editar assinatura</h1>
          <p className="text-xs text-muted-foreground font-body">Atualize os dados de {sub.name}</p>
        </div>
      </div>

      <form className="px-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Card do Serviço Atual (Estático) */}
        <div className="flex items-center gap-[14px] bg-card rounded-md py-4 px-4 mb-6 border border-border">
          <div
            className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px]"
            style={{ background: `${sub.color}22` }}
          >
            {sub.icon}
          </div>
          <div>
            <p className="font-heading font-semibold text-[17px]">{sub.name}</p>
            <p className="text-xs text-muted-foreground font-body">Originalmente detectado como {sub.category}</p>
          </div>
        </div>

        <div className="flex flex-col gap-[18px]">
          {/* Valor */}
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

          {/* Periodicidade */}
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

          {/* Próxima cobrança */}
          <Field label="Próxima cobrança" error={errors.nextCharge?.message}>
            <input
              type="date"
              className="w-full box-border bg-card border border-border rounded-sm p-[14px] font-body text-sm text-foreground outline-none [color-scheme:dark]"
              {...register("nextCharge")}
            />
          </Field>

          {/* Categoria */}
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

          {/* Forma de Pagamento */}
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
                : "Não foi possível salvar as alterações. Tente novamente."}
            </p>
          )}

          {/* Salvar */}
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full p-4 rounded-md border-none font-heading font-bold text-base transition-colors mb-6 bg-primary text-primary-foreground cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            {saveMutation.isPending ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
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
