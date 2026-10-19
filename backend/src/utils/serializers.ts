import type { User } from "../repositories/types";

// Nunca devolver `passwordHash` para o cliente. Esta função é o único lugar
// que converte um usuário de domínio em algo seguro para responder na API —
// equivalente ao que o frontend fazia "na mão" tirando `password` de
// `StoredUser` antes de guardar `CurrentUser` no localStorage.
// (Assinaturas não precisam de serializador: o objeto de domínio já é o
// formato público.)
export function toPublicUser(user: User) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    paymentMethod: user.paymentMethod,
    budgets: user.budgets,
  };
}
