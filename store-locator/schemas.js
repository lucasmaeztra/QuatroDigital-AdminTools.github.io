var schemas = {
	default: {
		title: "Quatro Digital",
		type: "object",
		properties: {
			store: {
				type: "array",
				format: "table",
				title: "Lojas",
				uniqueItems: true,
				items: {
					type: "object",
					title: "Loja",
					properties: {
						title: {
							type: "string",
							title: {
								default: "Título",
								"en": "Title"
							}
						},
						address: {
							type: "string",
							title: {
								default: "Endereço",
								"en": "Address"
							}
						},
						phone: {
							type: "string",
							title: {
								default: "Telefone",
								"en": "Phone Number"
							}
						},
						latitude: {
							type: "number",
							title: {
								default: "Latitude"
							}
						},
						longitude: {
							type: "number",
							title: {
								default: "Longitude"
							}
						}
					}
				}
			}
		}
	},
	"lion=en": {
		json: "https://lion-of-porches-cdn.github.io/stores-en.json",
		title: "Lion of Porches",
		properties: {
			store: {
				items: {
					properties: {
						country: {
							type: "string",
							title: {
								default: "País",
								"en": "Country"
							}
						},
						state: {
							type: "string",
							title: {
								default: "Estado",
								"en": "State"
							}
						},
						pickme: {
							type: "boolean",
							format: "checkbox",
							title: {
								default: "Pick Me"
							},
							defalt: false
						},
						link: {
							type: "string",
							format: "url",
							title: {
								default: "Google Maps Link"
							}
						}
					}
				}
			}
		}
	},
	"lion=pt": {
		json: "https://lion-of-porches-cdn.github.io/stores-pt.json",
		basis: "lion=en"
	},
	"lion=es": {
		json: "https://lion-of-porches-cdn.github.io/stores-es.json",
		basis: "lion=en"
	},
	"lion=fr": {
		json: "https://lion-of-porches-cdn.github.io/stores-fr.json",
		basis: "lion=en"
	},
	mahogany: {
		json: "https://qd-mahogany-cdn.github.io/arquivos/store.json",
		title: 'Mahogany',
		properties: {
			store: {
				items: {
					properties: {
						addressType: {
							type: "string",
							title: {
								default: "Tipo",
								"en": "Type"
							},
							enum: [
							"Loja",
							"Espaço",
							"Revendedor",
							"Todas"
							],
							default: "Todas"
						}
					}
				}
			}
		}
	},
	mahoganyV2: {
		json: "https://qd-mahogany-cdn.github.io/arquivos/store-v2.json",
		title: 'Mahogany',
		properties: {
			store: {
				items: {
					properties: {
						addressType: {
							type: "string",
							title: {
								default: "Tipo",
								"en": "Type"
							},
							enum: [
							"Loja",
							"Espaço",
							"Revendedor",
							"Todas"
							],
							default: "Todas"
						},
						email: {
							type: "string",
							title: {
								default: "E-mail",
								"en": "email"
							}
						}
					}
				}
			}
		}
	},
	drogariasp: {
		json: "",
		title: 'Drogaria São Paulo',
		properties: {
			store: {
				items: {
					properties: {
						attendance: {
							type: "string",
							title: {
								default: "Horário de Funcionamento",
								"en": "Attendance"
							}
						}
					}
				}
			}
		}
	},
	example: {
		json: "URL do JSON da loja",
		title: 'Nome da Loja',
		properties: {
			store: {
				items: {
					properties: {
						propriedade: {
							type: "Tipo (string/boolean/etc)",
							title: {
								default: "Nome do campo",
								other_language: "Field name"
							}
						}
					}
				}
			}
		}
	}
};

var default_json = {
	"store": []
};