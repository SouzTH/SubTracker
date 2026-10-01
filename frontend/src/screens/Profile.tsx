import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CurrentUser, CategoryBudgets, DEFAULT_BUDGETS, Screen } from "../App";
import { personalInfoSchema, PersonalInfoFormValues, budgetsSchema, BudgetsFormValues } from "../schemas/profile";
import { updateUser, ApiError } from "../lib/api";

interface Props {
  user: CurrentUser;
  onUserUpdate: (u: CurrentUser) => void;
  onLogout: () => void;
  navigate: (s: Screen) => void;
}

const PAYMENTS = ["Cartão de crédito", "Débito automático", "Pix", "Boleto"];
const CATEGORIES: (keyof CategoryBudgets)[] = ["Streaming", "Trabalho", "Fitness", "Música", "Jogos", "Outros"];

// Estilo base compartilhado pelos campos de texto/seleção desta tela.
const baseInputClass =
  "w-full box-border bg-background border border-border rounded-sm py-3 font-body text-sm text-foreground outline-none";

function saveButtonClass(busy: boolean) {
  return `w-full py-[13px] rounded-sm border-none font-heading font-bold text-sm mt-1 ${
    busy ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground cursor-pointer"
  }`;
}

export default function Profile({ user, onUserUpdate, onLogout, navigate }: Props) {
  const infoForm = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      nome: user.nome,
      telefone: user.telefone ?? "",
      paymentMethod: user.paymentMethod ?? PAYMENTS[0],
    },
  });

  const budgetsForm = useForm<BudgetsFormValues>({
    resolver: zodResolver(budgetsSchema),
    defaultValues: user.budgets ?? DEFAULT_BUDGETS,
  });

  const saveInfoMutation = useMutation({
    mutationFn: (values: PersonalInfoFormValues) => updateUser(user.id, values),
    onSuccess: (_data, values) => onUserUpdate({ ...user, ...values }),
  });

  const saveBudgetsMutation = useMutation({
    mutationFn: (values: BudgetsFormValues) => updateUser(user.id, { budgets: values }),
    onSuccess: (_data, values) => onUserUpdate({ ...user, budgets: values }),
  });

  const errorMessage = (error: unknown, fallback: string) =>
    error instanceof ApiError ? error.message : fallback;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="pt-14 px-6 pb-6 flex items-center gap-[14px]">
        <button
          onClick={() => navigate("dashboard")}
          className="w-9 h-9 rounded-sm bg-secondary border-none cursor-pointer flex items-center justify-center text-lg text-foreground"
        >
          ←
        </button>
        <div>
          <h1 className="font-heading font-bold text-[22px]">Meu Perfil</h1>
          <p className="text-xs text-muted-foreground font-body">{user.email}</p>
        </div>
      </div>

      <div className="px-6 pb-8 flex flex-col gap-6">
        {/* Dados pessoais */}
        <section className="bg-card border border-border rounded-[18px] p-5">
          <h2 className="font-heading font-bold text-base mb-4">Dados pessoais</h2>

          <form
            onSubmit={infoForm.handleSubmit((values) => saveInfoMutation.mutate(values))}
            noValidate
            className="flex flex-col gap-[14px]"
          >
            <Field label="Nome" error={infoForm.formState.errors.nome?.message}>
              <input type="text" className={`${baseInputClass} px-[14px]`} {...infoForm.register("nome")} />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={user.email}
                disabled
                title="O email não pode ser alterado por aqui."
                className={`${baseInputClass} px-[14px] opacity-60 cursor-not-allowed`}
              />
            </Field>

            <Field label="Telefone (opcional)">
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                className={`${baseInputClass} px-[14px]`}
                {...infoForm.register("telefone")}
              />
            </Field>

            <Field label="Forma de pagamento padrão" error={infoForm.formState.errors.paymentMethod?.message}>
              <select
                className={`${baseInputClass} px-[14px] appearance-none cursor-pointer [color-scheme:dark]`}
                {...infoForm.register("paymentMethod")}
              >
                {PAYMENTS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>

            <p className="text-xs text-muted-foreground font-body">
              Guardamos só um rótulo da forma de pagamento (ex.: "Cartão de crédito"), não o número do cartão —
              este protótipo não processa pagamentos de verdade.
            </p>

            {saveInfoMutation.isError && (
              <p className="text-red-500 text-[13px] font-body">
                {errorMessage(saveInfoMutation.error, "Não foi possível salvar seus dados. Verifique se o json-server está rodando.")}
              </p>
            )}

            <button type="submit" disabled={saveInfoMutation.isPending} className={saveButtonClass(saveInfoMutation.isPending)}>
              {saveInfoMutation.isPending ? "Salvando..." : saveInfoMutation.isSuccess ? "✓ Salvo!" : "Salvar dados"}
            </button>
          </form>
        </section>

        {/* Metas por categoria */}
        <section className="bg-card border border-border rounded-[18px] p-5">
          <h2 className="font-heading font-bold text-base mb-1.5">Metas por categoria</h2>
          <p className="text-xs text-muted-foreground font-body mb-4">
            Define quanto você quer gastar por mês em cada categoria. Essas metas alimentam as barras de progresso do Dashboard.
          </p>

          <form
            onSubmit={budgetsForm.handleSubmit((values) => saveBudgetsMutation.mutate(values))}
            noValidate
            className="flex flex-col gap-3"
          >
            {CATEGORIES.map((cat) => (
              <Field key={cat} label={cat} error={budgetsForm.formState.errors[cat]?.message}>
                <div className="relative">
                  <span className="absolute left-[14px] top-1/2 -translate-y-1/2 font-heading font-semibold text-sm text-primary">
                    R$
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className={`${baseInputClass} pl-10 pr-[14px]`}
                    {...budgetsForm.register(cat)}
                  />
                </div>
              </Field>
            ))}

            {saveBudgetsMutation.isError && (
              <p className="text-red-500 text-[13px] font-body">
                {errorMessage(saveBudgetsMutation.error, "Não foi possível salvar suas metas. Verifique se o json-server está rodando.")}
              </p>
            )}

            <button type="submit" disabled={saveBudgetsMutation.isPending} className={saveButtonClass(saveBudgetsMutation.isPending)}>
              {saveBudgetsMutation.isPending ? "Salvando..." : saveBudgetsMutation.isSuccess ? "✓ Salvo!" : "Salvar metas"}
            </button>
          </form>
        </section>

        {/* Como confirmar pagamentos */}
        <section className="bg-card border border-border rounded-[18px] p-5">
          <h2 className="font-heading font-bold text-base mb-2">Como confirmar pagamentos</h2>
          <p className="text-[13px] text-muted-foreground font-body leading-[1.5]">
            Abra uma assinatura e toque em <strong className="text-foreground">"Confirmar Pagamento"</strong> quando
            a cobrança cair na sua conta. Se preferir, importe o extrato do banco: quando uma cobrança já existente
            é encontrada lá, o SubTracker confirma o pagamento automaticamente, em vez de criar uma assinatura duplicada.
          </p>
        </section>

        <button
          onClick={onLogout}
          className="p-[14px] rounded-[14px] border border-red-500/30 bg-red-500/7 text-red-500 font-heading font-semibold text-sm cursor-pointer"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}

function Field({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground font-body mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs font-body mt-1">{error}</p>}
    </div>
  );
}
