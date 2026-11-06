/*
  Dados da demo "Tente enganar o validador", em português e inglês.
  Gerado por projetos/discovery-crm/gerar_demo.js a partir das reuniões
  fictícias e dos blueprints de teste. Não edite à mão.
*/
window.DISCOVERY = {
 "pt": {
  "empresa": "Grão Norte Insumos (fictícia)",
  "falas": [
   {
    "quem": "Consultor",
    "fala": "Para começar, me contem como funciona a venda hoje, do primeiro contato até o pedido."
   },
   {
    "quem": "Ricardo",
    "fala": "A gente distribui fertilizante e defensivo para produtor rural e para revenda. São dois tipos de cliente bem diferentes. O produtor compra por safra, a revenda compra o ano inteiro. Hoje tudo isso está em planilha, cada representante tem a sua."
   },
   {
    "quem": "Juliana",
    "fala": "E ninguém sabe o que o outro está negociando. Já aconteceu de dois representantes visitarem a mesma fazenda na mesma semana."
   },
   {
    "quem": "Consultor",
    "fala": "Quantas pessoas vendem?"
   },
   {
    "quem": "Ricardo",
    "fala": "São 9 representantes de campo e 3 pessoas aqui no interno, comigo e com a Juliana."
   },
   {
    "quem": "Consultor",
    "fala": "E como começa uma venda para o produtor?"
   },
   {
    "quem": "Ricardo",
    "fala": "Geralmente o representante visita, faz uma análise de solo ou pega a análise que o produtor já tem, e monta uma recomendação. Depois vem a cotação, a negociação, e quando fecha vira pedido no ERP."
   },
   {
    "quem": "Juliana",
    "fala": "A recomendação técnica é importante. Sem ela o agrônomo do produtor nem conversa com a gente."
   },
   {
    "quem": "Consultor",
    "fala": "Então a recomendação é uma etapa obrigatória antes da cotação?"
   },
   {
    "quem": "Ricardo",
    "fala": "É. Não deveria sair cotação sem recomendação anexada."
   },
   {
    "quem": "Consultor",
    "fala": "E o que vocês precisam saber do produtor para cotar?"
   },
   {
    "quem": "Ricardo",
    "fala": "Área plantada em hectares, a cultura, que pode ser soja, milho, café ou cana, e a safra. A gente vende por tonelada, então o volume em toneladas é o que mais importa."
   },
   {
    "quem": "Juliana",
    "fala": "E a forma de pagamento. Muito produtor paga na colheita, é o que chamam de pagamento safra."
   },
   {
    "quem": "Consultor",
    "fala": "E para a revenda, muda o quê?"
   },
   {
    "quem": "Ricardo",
    "fala": "A revenda é mais recorrente. Tem tabela de preço própria, e o que importa é o pedido mensal. Não tem recomendação técnica. É mais reposição de estoque."
   },
   {
    "quem": "Consultor",
    "fala": "Tem aprovação de desconto?"
   },
   {
    "quem": "Ricardo",
    "fala": "Tem. Até 5% o representante dá sozinho. Acima de 5% passa por mim."
   },
   {
    "quem": "Consultor",
    "fala": "E depois que vira pedido, o que acontece?"
   },
   {
    "quem": "Juliana",
    "fala": "Eu lanço no ERP. Hoje é digitado à mão, eu copio da planilha. Gostaria muito que isso não fosse mais à mão."
   },
   {
    "quem": "Consultor",
    "fala": "Qual ERP vocês usam?"
   },
   {
    "quem": "Juliana",
    "fala": "É um sistema próprio, feito por uma empresa daqui da região. Eles disseram que tem API, mas eu nunca vi a documentação."
   },
   {
    "quem": "Consultor",
    "fala": "Ótimo, vou anotar isso como algo a confirmar. Quando vocês perdem uma venda, registram o motivo?"
   },
   {
    "quem": "Ricardo",
    "fala": "Não registramos, e isso me incomoda. Acho que perdemos muito por preço e por prazo de entrega, mas é achismo."
   },
   {
    "quem": "Consultor",
    "fala": "E pós-venda? Alguém acompanha a aplicação, a satisfação?"
   },
   {
    "quem": "Ricardo",
    "fala": "O representante deveria voltar 30 dias depois da entrega para ver se correu tudo bem. Na prática ninguém lembra."
   },
   {
    "quem": "Juliana",
    "fala": "Se o sistema criasse uma tarefa para ele, ajudaria."
   },
   {
    "quem": "Consultor",
    "fala": "Perfeito. Mais alguma coisa que vocês querem enxergar no CRM?"
   },
   {
    "quem": "Ricardo",
    "fala": "Quero saber quanto tenho em negociação por safra e por representante. Hoje eu só descubro no fim do mês."
   }
  ],
  "blueprint": {
   "cliente": {
    "segmento": "Distribuição de fertilizantes e defensivos",
    "tamanho_do_time": "9 representantes de campo e 3 pessoas no interno",
    "resumo_do_processo": "Venda para produtor rural por safra, com recomendação técnica antes da cotação, e venda recorrente para revendas por tabela de preço."
   },
   "funis": [
    {
     "nome": "Produtor rural",
     "objetivo": "Vendas por safra para produtores",
     "etapas": [
      {
       "nome": "Visita feita",
       "criterio_de_saida": "Análise de solo coletada",
       "checklist": [
        "Registrar área e cultura"
       ]
      },
      {
       "nome": "Recomendação técnica",
       "criterio_de_saida": "Recomendação anexada",
       "checklist": []
      },
      {
       "nome": "Cotação enviada",
       "criterio_de_saida": "Cliente recebeu a cotação",
       "checklist": []
      },
      {
       "nome": "Negociação",
       "criterio_de_saida": "Condições aceitas",
       "checklist": [
        "Desconto acima de 5% aprovado pelo diretor"
       ]
      },
      {
       "nome": "Pedido no ERP",
       "criterio_de_saida": "Pedido lançado",
       "checklist": []
      }
     ]
    },
    {
     "nome": "Revenda",
     "objetivo": "Reposição recorrente de estoque",
     "etapas": [
      {
       "nome": "Pedido em montagem",
       "criterio_de_saida": "Itens definidos",
       "checklist": []
      },
      {
       "nome": "Cotação enviada",
       "criterio_de_saida": "Revenda recebeu",
       "checklist": []
      },
      {
       "nome": "Pedido no ERP",
       "criterio_de_saida": "Pedido lançado",
       "checklist": []
      }
     ]
    }
   ],
   "campos": [
    {
     "entidade": "negocio",
     "nome": "Área plantada (ha)",
     "tipo": "numero",
     "opcoes": [],
     "obrigatorio_na_etapa": "Cotação enviada",
     "motivo": "Base da cotação"
    },
    {
     "entidade": "negocio",
     "nome": "Cultura",
     "tipo": "lista",
     "opcoes": [
      "Soja",
      "Milho",
      "Café",
      "Cana"
     ],
     "obrigatorio_na_etapa": "Cotação enviada",
     "motivo": "Base da recomendação"
    },
    {
     "entidade": "negocio",
     "nome": "Volume (t)",
     "tipo": "numero",
     "opcoes": [],
     "obrigatorio_na_etapa": null,
     "motivo": "Venda por tonelada"
    }
   ],
   "automacoes": [
    {
     "nome": "Visita pós-entrega",
     "gatilho": "Negócio ganho",
     "acao": "Criar tarefa para o representante 30 dias depois",
     "tipo": "nativa",
     "motivo": "Ninguém lembra de voltar"
    }
   ],
   "integracoes": [
    {
     "sistema": "ERP próprio",
     "direcao": "saida",
     "dados": "Pedido fechado",
     "status": "a_confirmar"
    }
   ],
   "motivos_de_perda": [
    "Preço",
    "Prazo de entrega"
   ],
   "duvidas_para_o_cliente": [
    "Qual é a documentação da API do ERP?",
    "A safra é um campo de lista ou de texto?"
   ],
   "origem": [
    {
     "item": "Visita feita",
     "trecho": "Geralmente o representante visita, faz uma análise de solo"
    },
    {
     "item": "Recomendação técnica",
     "trecho": "Não deveria sair cotação sem recomendação anexada."
    },
    {
     "item": "Cotação enviada",
     "trecho": "Depois vem a cotação, a negociação"
    },
    {
     "item": "Negociação",
     "trecho": "Acima de 5% passa por mim."
    },
    {
     "item": "Pedido no ERP",
     "trecho": "quando fecha vira pedido no ERP"
    },
    {
     "item": "Pedido em montagem",
     "trecho": "É mais reposição de estoque."
    },
    {
     "item": "Área plantada (ha)",
     "trecho": "Área plantada em hectares"
    },
    {
     "item": "Cultura",
     "trecho": "que pode ser soja, milho, café ou cana"
    },
    {
     "item": "Volume (t)",
     "trecho": "A gente vende por tonelada"
    },
    {
     "item": "Visita pós-entrega",
     "trecho": "O representante deveria voltar 30 dias depois da entrega"
    },
    {
     "item": "ERP próprio",
     "trecho": "Eles disseram que tem API, mas eu nunca vi a documentação."
    }
   ]
  }
 },
 "en": {
  "empresa": "Grão Norte Insumos (fictional)",
  "falas": [
   {
    "quem": "Consultant",
    "fala": "To start, tell me how selling works today, from the first contact to the order."
   },
   {
    "quem": "Ricardo",
    "fala": "We distribute fertilizer and crop protection products to farmers and to resellers. They are two very different types of customer. Farmers buy per season, resellers buy all year round. Today all of this lives in spreadsheets, and each rep has their own."
   },
   {
    "quem": "Juliana",
    "fala": "And nobody knows what the others are negotiating. Two reps have already visited the same farm in the same week."
   },
   {
    "quem": "Consultant",
    "fala": "How many people sell?"
   },
   {
    "quem": "Ricardo",
    "fala": "There are 9 field reps and 3 people here in the office, including me and Juliana."
   },
   {
    "quem": "Consultant",
    "fala": "And how does a sale to a farmer start?"
   },
   {
    "quem": "Ricardo",
    "fala": "Usually the rep visits, does a soil analysis or takes the one the farmer already has, and puts together a recommendation. Then comes the quote, the negotiation, and when it closes it becomes an order in the ERP."
   },
   {
    "quem": "Juliana",
    "fala": "The technical recommendation matters. Without it the farmer's agronomist won't even talk to us."
   },
   {
    "quem": "Consultant",
    "fala": "So the recommendation is a required stage before the quote?"
   },
   {
    "quem": "Ricardo",
    "fala": "Yes. No quote should go out without the recommendation attached."
   },
   {
    "quem": "Consultant",
    "fala": "And what do you need to know about the farmer to send a quote?"
   },
   {
    "quem": "Ricardo",
    "fala": "Planted area in hectares, the crop, which can be soybean, corn, coffee or sugarcane, and the season. We sell by the ton, so the volume in tons is what matters most."
   },
   {
    "quem": "Juliana",
    "fala": "And the payment terms. Many farmers pay at harvest time, what people call harvest payment."
   },
   {
    "quem": "Consultant",
    "fala": "And for resellers, what changes?"
   },
   {
    "quem": "Ricardo",
    "fala": "Resellers are more recurring. They have their own price list, and what matters is the monthly order. There is no technical recommendation. It's mostly restocking."
   },
   {
    "quem": "Consultant",
    "fala": "Is there a discount approval?"
   },
   {
    "quem": "Ricardo",
    "fala": "Yes. Up to 5% the rep can give on their own. Above 5% it goes through me."
   },
   {
    "quem": "Consultant",
    "fala": "And after it becomes an order, what happens?"
   },
   {
    "quem": "Juliana",
    "fala": "I enter it in the ERP. Today it's typed by hand, I copy it from the spreadsheet. I would really like this to stop being manual."
   },
   {
    "quem": "Consultant",
    "fala": "Which ERP do you use?"
   },
   {
    "quem": "Juliana",
    "fala": "It's a custom system, built by a local company. They said it has an API, but I've never seen the documentation."
   },
   {
    "quem": "Consultant",
    "fala": "Great, I'll note that as something to confirm. When you lose a sale, do you record the reason?"
   },
   {
    "quem": "Ricardo",
    "fala": "We don't, and that bothers me. I think we lose a lot on price and on delivery time, but it's a guess."
   },
   {
    "quem": "Consultant",
    "fala": "And after the sale? Does anyone follow up on the application, on satisfaction?"
   },
   {
    "quem": "Ricardo",
    "fala": "The rep should go back 30 days after delivery to check that everything went well. In practice nobody remembers."
   },
   {
    "quem": "Juliana",
    "fala": "If the system created a task for them, that would help."
   },
   {
    "quem": "Consultant",
    "fala": "Perfect. Anything else you want to see in the CRM?"
   },
   {
    "quem": "Ricardo",
    "fala": "I want to know how much I have in negotiation per season and per rep. Today I only find out at the end of the month."
   }
  ],
  "blueprint": {
   "cliente": {
    "segmento": "Distribution of fertilizers and crop protection products",
    "tamanho_do_time": "9 field reps and 3 people in the office",
    "resumo_do_processo": "Seasonal sales to farmers, with a technical recommendation before the quote, and recurring sales to resellers based on a price list."
   },
   "funis": [
    {
     "nome": "Farmer",
     "objetivo": "Seasonal sales to farmers",
     "etapas": [
      {
       "nome": "Visit done",
       "criterio_de_saida": "Soil analysis collected",
       "checklist": [
        "Record area and crop"
       ]
      },
      {
       "nome": "Technical recommendation",
       "criterio_de_saida": "Recommendation attached",
       "checklist": []
      },
      {
       "nome": "Quote sent",
       "criterio_de_saida": "Customer received the quote",
       "checklist": []
      },
      {
       "nome": "Negotiation",
       "criterio_de_saida": "Terms accepted",
       "checklist": [
        "Discount above 5% approved by the director"
       ]
      },
      {
       "nome": "Order in ERP",
       "criterio_de_saida": "Order entered",
       "checklist": []
      }
     ]
    },
    {
     "nome": "Reseller",
     "objetivo": "Recurring restocking",
     "etapas": [
      {
       "nome": "Order being assembled",
       "criterio_de_saida": "Items defined",
       "checklist": []
      },
      {
       "nome": "Quote sent",
       "criterio_de_saida": "Reseller received it",
       "checklist": []
      },
      {
       "nome": "Order in ERP",
       "criterio_de_saida": "Order entered",
       "checklist": []
      }
     ]
    }
   ],
   "campos": [
    {
     "entidade": "negocio",
     "nome": "Planted area (ha)",
     "tipo": "numero",
     "opcoes": [],
     "obrigatorio_na_etapa": "Quote sent",
     "motivo": "Basis for the quote"
    },
    {
     "entidade": "negocio",
     "nome": "Crop",
     "tipo": "lista",
     "opcoes": [
      "Soybean",
      "Corn",
      "Coffee",
      "Sugarcane"
     ],
     "obrigatorio_na_etapa": "Quote sent",
     "motivo": "Basis for the recommendation"
    },
    {
     "entidade": "negocio",
     "nome": "Volume (t)",
     "tipo": "numero",
     "opcoes": [],
     "obrigatorio_na_etapa": null,
     "motivo": "Sold by the ton"
    }
   ],
   "automacoes": [
    {
     "nome": "Post-delivery visit",
     "gatilho": "Deal won",
     "acao": "Create a task for the rep 30 days later",
     "tipo": "nativa",
     "motivo": "Nobody remembers to go back"
    }
   ],
   "integracoes": [
    {
     "sistema": "Custom ERP",
     "direcao": "saida",
     "dados": "Closed order",
     "status": "a_confirmar"
    }
   ],
   "motivos_de_perda": [
    "Price",
    "Delivery time"
   ],
   "duvidas_para_o_cliente": [
    "Where is the documentation for the ERP API?",
    "Should the season be a picklist or a text field?"
   ],
   "origem": [
    {
     "item": "Visit done",
     "trecho": "Usually the rep visits, does a soil analysis"
    },
    {
     "item": "Technical recommendation",
     "trecho": "No quote should go out without the recommendation attached."
    },
    {
     "item": "Quote sent",
     "trecho": "Then comes the quote, the negotiation"
    },
    {
     "item": "Negotiation",
     "trecho": "Above 5% it goes through me."
    },
    {
     "item": "Order in ERP",
     "trecho": "when it closes it becomes an order in the ERP"
    },
    {
     "item": "Order being assembled",
     "trecho": "It's mostly restocking."
    },
    {
     "item": "Planted area (ha)",
     "trecho": "Planted area in hectares"
    },
    {
     "item": "Crop",
     "trecho": "which can be soybean, corn, coffee or sugarcane"
    },
    {
     "item": "Volume (t)",
     "trecho": "We sell by the ton"
    },
    {
     "item": "Post-delivery visit",
     "trecho": "The rep should go back 30 days after delivery"
    },
    {
     "item": "Custom ERP",
     "trecho": "They said it has an API, but I've never seen the documentation."
    }
   ]
  }
 }
};
