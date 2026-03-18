function setLoading(isLoading) {
    const btnSpan = document.getElementById("generate-btn");
    if (isLoading) {
        btnSpan.innerHTML = "Gerando Background...";
    } else {
        btnSpan.innerHTML = "Gerar Background Mágico";
    }
}

/*
   SETLOADING - NOME DA FUNÇÃO 
   ISLOADING - PARÂMETRO QUE ESPERA TRUE (VERDADEIRO) OU FALSE (FALSO)
   CONST BTNSPAN - SERVE PARA "CHAMAR" O ELEMENTO NO HTML COM NOME "GENERATE-BTN"
   IF ISLOADING (TRUE) - SE FOR VERDADEIRO, ENTÃO O TEXTO NO BOTÃO MUDA PARA "GERANDO BACKGROUND MÁGICO" INDICANDO QUE A IMAGEM ESTA SENDO PROCESSADA
   IF ISLOADING (FALSE) - SE FOR FALSO, O TEXTO VOLTA PARA "GERAR BACKGROUND MÁGICO" INDICANDO QUE OCORREU UM PROBLEMA NO CÓDIGO E A SOLICITAÇÃO DO USUÁRIO NÃO FOI PROCESSADA  
*/

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form-group");
    const textArea = document.getElementById("description");
    const htmlCode = document.getElementById("html-code");
    const cssCode = document.getElementById("css-code");
    const preview = document.getElementById("preview-section");

/*
   DOCUMENT.ADDEVENT - SERVE PARA QUE ANTES DE EXECUTAR A FUNÇÃO, O PROGRAMA ESPERE TODO O HTML CARREGAR
   CONST FORM - SERVE PARA QUE O SISTEMA IDENTIFIQUE QUANDO O USUÁRIO CLICAR NO BOTÃO DE ENVIAR
   CONST TEXTAREA - SERVE PARA "GUARDAR" O QUE O USUÁRIO VAI ESCREVER PARA QUE O AGENTE EXECUTE DE ACORDO 
   CONST HTMLCODE - SERVE PARA MOSTRAR AO USUÁRIO O ESQUELETO QUE A IA CRIOU
   CONST CSSCODE - SERVE PARA MOSTRAR AO USUÁRIO O CÓDIGO DE ESTILO QUE A IA CRIOU
   CONST PREVIEW - SERVE PARA APLICAR O PLANO DE FUNDO CRIADO PELA IA
*/

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const description = textArea.value.trim();
        if (!description) return;

        setLoading(true);

        try {
            const response = await fetch("https://gabrielporcela.app.n8n.cloud/webhook/Fundo-Magico", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });
            
            const data = await response.json();
            console.log("Dados recebidos da IA:", data);

/*
   FROM.ADDEVENTLISTENER("SUBMIT", ASYNC FUNCTION (EVENT)) - SERVE PARA QUE O PROGRAMA EXECUTE UMA LISTA DE TAREFAS NO MOMENTO EM QUE O USUÁRIO CLICAR NO BOTÃO DE ENVIAR OU APERTAR 
   EVENT.PREVENTDEFAULT - SERVE PARA QUE O PROGRAMA NÃO RECARREGUE A PÁGINA, COMO POR PADRÃO, MAS APLIQUE NA MESMA PÁGINA
   CONST DESCRIPTION = TEXTAREA.VALUE.TRIM() - SERVE PARA PEGAR O QUE O USUÁRIO DIGITAR NA CAIXA DE TEXTO E COM O "TRIM()", LIMPAR OS ESPAÇOS VAZIOS NO INÍCIO OU NO FINAL
   IF (!DESCRIPTION) RETURN - SERVE PARA QUE A EXECUÇÃO PARE SEJA CANCELADA SE A CAIXA ESTIVER VAZIA
*/

            htmlCode.textContent = data.html || "";
            cssCode.textContent = data.css || "";

/* 
   1. PREENCHE OS CAMPOS DE TEXTO COM OS CÓDIGOS NAS CAIXAS DE TEXTO (PARA O USUÁRIO VER) 
*/

            preview.innerHTML = data.html || "";
            preview.style.display = "block";

/*
   2. SERVE PARA APLICAR O CÓDIGO (PLANO DE FUNDO) CRIADO PELA A IA A PARTIR DA SUGESTÃO DO USUÁRIO
*/

            let styleTag = document.getElementById("dynamic-style");
            if (styleTag) styleTag.remove();
/*
   3. SERVE PARA LIMPAR OS ESTILOS APLICADOS NA PÁGINA ANTES DE COLOCAR O NOVO
*/
            if (data.css) {
                styleTag = document.createElement("style");
                styleTag.id = "dynamic-style";

/*
   SE A IA ENVIOU ESTILOS, O CÓDIGO SERVE PARA CRIAR UMA NOVA ETIQUETA DE ESTILOS (COMO UM ARQUIVO DE DESIGN NA HORA)
*/
                
                const resetCSS = 
                `
                    #preview-section {  
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        z-index: -1 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                    }
                `;
/*
   CONST RESETCSS - SERVE PARA DEFINIR COMO A ANIMAÇÃO DEVE SE COMPORTAR EM RELAÇÃO AO RESTO DA PÁGINA
   POSITION - PRENDE A ANIMAÇÃO NA TELA (NÃO FOGE AO ROLAR A TELA)
   TOP - ALINHA NO TOPO
   LEFT - ALINHA NA ESQUERDA
   WIDTH - FAZ OCUPAR 100% DA LARGURA DA TELA 
   HEIGHT - FAZ OCUPAR 100% DA ALTURA DA TELA 
   Z-INDEX - COLOCA ATRÁS DE TUDO (COMO UM PAPEL DE PAREDE)
   MARGIN - REMOVE ESPAÇOS EXTERNOS 
   PADDING - REMOVE ESPAÇOS INTERNOS 
   OVERFLOW - GARANTE QUE NADA VAZE OU CRIE BARRAS DE ROLAGEM 
*/
                
                styleTag.textContent = resetCSS + data.css; 
                document.head.appendChild(styleTag);

/*
   STYLETAG.TEXTCONTENT - SERVE PARA JUNTAR AS REGRAS DE LIMPEZA E DESIGN VISUAL QUE A IA CRIOU
   DOCUMENT.HEAD - SERVE PARA QUE AS NOVAS REGRAS DE DESIGN SEJAM APLICADAS
*/

                document.body.style.backgroundImage = "none";
                document.body.style.backgroundColor = "transparent";
            }

/*
   DOCUMENT.BODY.STYLE.BACKGROUNDIMAGE - SERVE PARA EXCLUIR POR COMPLETO O PLANO DE FUNDO ANTERIOR, PARA MOSTRAR O NOVO
   DOCUMENT.BODY.STYLE.BACKGROUNDCOLOR - SERVE PARA TORNAR O PLANO DE FUNDO FIXO DO SITE TRANSPARENTE O SUFICIENTE PARA QUE A ANIMAÇÃO DA IA APAREÇA POR CIMA 
*/

        } catch (error) {
            console.error("Erro ao gerar o fundo:", error);
            htmlCode.textContent = "Erro ao carregar HTML.";
            cssCode.textContent = "Erro ao carregar CSS.";
            preview.innerHTML = "";
        } finally {
            setLoading(false);
        }

/*
   CONSOLE.ERROR - AVISA O PROGRAMADOR NO CONSOLE O QUE DEU ERRADO
   HTMLCODE - AVISA O USUÁRIO NA TELA 
   CSSCODE - AVISA O USUÁRIO NA TELA 
   PREVIEW - LIMPA A TELA PARA NÃO MOSTRAR LIXO
*/
    });
});