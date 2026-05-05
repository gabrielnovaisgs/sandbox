# Ticket: LogAnalyzer-01 - CLI de Processamento de Logs Otimizado
## Contexto:
Precisamos de uma ferramenta rápida e crua no terminal para vasculhar arquivos de log pesados (como os que você deve ter rodando no seu ambiente Fedora) em busca de anomalias, garantindo que a execução seja performática e eficiente no uso de recursos.

## Regras de Negócio & Funcionalidades:

Entrada: A CLI deve receber o caminho absoluto ou relativo de um arquivo de texto como argumento na execução do comando.

Processamento: A ferramenta deve varrer o arquivo sequencialmente e filtrar exclusivamente as linhas que contenham as palavras ERROR ou WARN.

Modelagem: Cada linha válida encontrada deve ser "parseada" e armazenada em uma estrutura de dados de domínio contendo: Timestamp, Nivel (Error/Warn) e a Mensagem.

Saída: Ao final da execução, exibir um relatório consolidado no stdout contendo:

A contagem total de ocorrências de ERROR.

A contagem total de ocorrências de WARN.

A listagem das mensagens capturadas com seus respectivos tempos.

Restrições Técnicas & Requisitos Não-Funcionais:

Zero-Crash de Memória: O sistema deve ser capaz de ler um log de 10GB em uma máquina com 512MB de RAM sem estourar a memória. É terminantemente proibido carregar o arquivo todo em memória de uma vez.

Gestão de Recursos: A liberação de recursos do sistema operacional (file descriptors) deve ser garantida e incondicional após o término da leitura, mesmo se ocorrer uma falha no meio do processo.

Tratamento de Erros: Erros de sistema de arquivos (ex: arquivo não encontrado, sem permissão de leitura) devem ser tratados imediatamente onde ocorrem, com mensagens claras para o usuário final, encerrando a execução com o código de saída (exit code) apropriado.