from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid


def new_id() -> str:
    return str(uuid.uuid4())


class OrderStatus(str, Enum):
    RECEBIDO = "recebido"
    EM_ANALISE = "em_analise"
    AGUARDANDO_PECA = "aguardando_peca"
    PRONTO = "pronto"
    ENTREGUE = "entregue"


class PaymentStatus(str, Enum):
    PENDENTE = "pendente"
    PAGO = "pago"
    ATRASADO = "atrasado"


# ---------- Tenant (oficina / prestador) ----------
class Tenant(BaseModel):
    id: str = Field(default_factory=new_id)
    nome: str
    subdominio: str  # ex: joaoinformatica -> joaoinformatica.itatechos.com.br
    categoria: str  # informática, câmeras, moto, elétrica, etc
    telefone: Optional[str] = None
    whatsapp: Optional[str] = None
    logo_url: Optional[str] = None
    ativo: bool = True
    criado_em: datetime = Field(default_factory=datetime.utcnow)


class TenantCreate(BaseModel):
    nome: str
    subdominio: str
    categoria: str
    telefone: Optional[str] = None
    whatsapp: Optional[str] = None


# ---------- Customer ----------
class Customer(BaseModel):
    id: str = Field(default_factory=new_id)
    tenant_id: str
    nome: str
    telefone: str
    email: Optional[str] = None
    endereco: Optional[str] = None
    criado_em: datetime = Field(default_factory=datetime.utcnow)


class CustomerCreate(BaseModel):
    tenant_id: str
    nome: str
    telefone: str
    email: Optional[str] = None
    endereco: Optional[str] = None


# ---------- Equipment ----------
class Equipment(BaseModel):
    id: str = Field(default_factory=new_id)
    customer_id: str
    tenant_id: str
    tipo: str  # notebook, câmera, moto, geladeira...
    marca: Optional[str] = None
    modelo: Optional[str] = None
    numero_serie: Optional[str] = None
    criado_em: datetime = Field(default_factory=datetime.utcnow)


class EquipmentCreate(BaseModel):
    customer_id: str
    tenant_id: str
    tipo: str
    marca: Optional[str] = None
    modelo: Optional[str] = None
    numero_serie: Optional[str] = None


# ---------- Orçamento ----------
class BudgetItem(BaseModel):
    descricao: str
    valor: float


class Budget(BaseModel):
    itens: List[BudgetItem] = []
    valor_total: float = 0.0
    aprovado: bool = False
    aprovado_em: Optional[datetime] = None


# ---------- Service Order ----------
class ServiceOrder(BaseModel):
    id: str = Field(default_factory=new_id)
    numero_os: str  # gerado sequencialmente por tenant
    tenant_id: str
    customer_id: str
    equipment_id: str
    defeito_relatado: str
    fotos: List[str] = []
    status: OrderStatus = OrderStatus.RECEBIDO
    orcamento: Budget = Field(default_factory=Budget)
    token_publico: str = Field(default_factory=new_id)
    assinatura_cliente: Optional[str] = None  # base64 da assinatura
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)


class ServiceOrderCreate(BaseModel):
    tenant_id: str
    customer_id: str
    equipment_id: str
    defeito_relatado: str
    fotos: List[str] = []


class StatusUpdate(BaseModel):
    novo_status: OrderStatus


# ---------- Status History ----------
class StatusHistoryEntry(BaseModel):
    id: str = Field(default_factory=new_id)
    service_order_id: str
    status_anterior: Optional[str] = None
    status_novo: str
    data: datetime = Field(default_factory=datetime.utcnow)


# ---------- Payment ----------
class Payment(BaseModel):
    id: str = Field(default_factory=new_id)
    service_order_id: str
    tenant_id: str
    valor: float
    forma: Optional[str] = None  # dinheiro, pix, cartão
    status: PaymentStatus = PaymentStatus.PENDENTE
    data_pagamento: Optional[datetime] = None
    criado_em: datetime = Field(default_factory=datetime.utcnow)


class PaymentCreate(BaseModel):
    service_order_id: str
    tenant_id: str
    valor: float
    forma: Optional[str] = None
