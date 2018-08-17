var schemas={default:{title:"Quatro Digital",type:"object",fileNameJson:"stores.json",fileNameHtml:"stores.html",fileNameJS:"stores.js",jsVariableName:"qdStoreLocator_jsStores",properties:{store:{type:"array",format:"table",title:"Lojas",uniqueItems:!0,items:{type:"object",title:"Loja",properties:{title:{type:"string",title:{default:"Título",en:"Title"}},address:{type:"string",title:{default:"Endereço",en:"Address",es:"Dirección"}},phone:{type:"string",title:{default:"Telefone",en:"Phone Number",es:"Teléfono"}},latitude:{type:"number",title:{default:"Latitude",es:"Latitud"}},longitude:{type:"number",title:{default:"Longitude",es:"Longitud"}}}}}}},"lion=en":{json:"https://lion-of-porches-cdn.github.io/stores-en.json",title:"Lion of Porches",properties:{store:{items:{properties:{country:{type:"string",title:{default:"País",en:"Country"}},state:{type:"string",title:{default:"Estado",en:"State"}},pickme:{type:"boolean",format:"checkbox",title:{default:"Pick Me"},defalt:!1},link:{type:"string",format:"url",title:{default:"Google Maps Link"}}}}}}},"lion=pt":{json:"https://lion-of-porches-cdn.github.io/stores-pt.json",basis:"lion=en"},"lion=es":{json:"https://lion-of-porches-cdn.github.io/stores-es.json",basis:"lion=en"},"lion=fr":{json:"https://lion-of-porches-cdn.github.io/stores-fr.json",basis:"lion=en"},mahogany:{json:"https://qd-mahogany-cdn.github.io/arquivos/store.json",title:"Mahogany",properties:{store:{items:{properties:{addressType:{type:"string",title:{default:"Tipo",en:"Type"},enum:["Loja","Espaço","Revendedor","Todas"],default:"Todas"}}}}}},abrakadabra:{json:"https://abrakadabra.vteximg.com.br/arquivos/stores.js",title:"Abrakadabra",properties:{store:{items:{properties:{city:{type:"string",title:{default:"Cidade",en:"City"}},state:{type:"string",title:{default:"Estado",en:"State"}},cep:{type:"string",title:{default:"CEP",en:"CEP"}},whatsApp:{type:"string",title:{default:"WhatsApp",en:"WhatsApp"}},openOnHolidays:{type:"boolean",format:"checkbox",title:{default:"Aberto em Feriados?"},defalt:!1},businessHours:{type:"string",title:{default:"Horário de Funcionamento",en:"Business Hours"}},email:{type:"string",format:"email",title:{default:"E-mail",en:"E-mail"}},mapURL:{type:"string",format:"url",title:{default:"URL do Google Maps"}}}}}}},embelleze:{json:"https://embelleze.vteximg.com.br/arquivos/stores.js",title:"Embelleze",properties:{store:{items:{properties:{brand:{type:"string",title:{default:"Marca",en:"Brand"},enum:["Vitay","Todas"],default:"Todas"}}}}}},auteco:{json:"https://auteco.vteximg.com.br/arquivos/stores.js",title:"Auteco",properties:{store:{title:"Tiendas",items:{title:"Tienda",properties:{storeType:{type:"string",title:{default:"Tipo de Loja",en:"Store Type",es:"Tipo de Tienda"},enum:["Tiendas","Oficina Mecanica"],default:"Tiendas"}}}}}},example:{json:"URL do JSON da loja",title:"Nome da Loja",properties:{store:{items:{properties:{propriedade:{type:"Tipo (string/boolean/etc)",title:{default:"Nome do campo",other_language:"Field name"}}}}}}}},default_json={store:[]};