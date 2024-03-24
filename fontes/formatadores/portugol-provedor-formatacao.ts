import * as vscode from 'vscode';
import * as sistemaOperacional from 'node:os';
import { LexadorPortugolStudio } from '@designliquido/delegua/dist/lexador/dialetos';
import { AvaliadorSintaticoPortugolStudio, FormatadorPortugolStudio } from '@designliquido/delegua/dist';




export class PortugolProvedorFormatacao implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const lexador = new LexadorPortugolStudio();
        const avaliadorSintatico = new AvaliadorSintaticoPortugolStudio();
        const formatador = new FormatadorPortugolStudio(sistemaOperacional.EOL);

        const resultadoLexador = lexador.mapear(document.getText().split('\n'), -1);
        const resultadoAvaliacaoSintatica = avaliadorSintatico.analisar(resultadoLexador, -1);
        let codigoFormatado: string = document.getText();
        try {
            codigoFormatado = formatador.formatar(resultadoAvaliacaoSintatica.declaracoes);
        } catch (erro) {
            console.error(erro);
        }

        return [
            vscode.TextEdit.replace(
                new vscode.Range(
                    document.lineAt(0).range.start,
                    document.lineAt(document.lineCount - 1).range.end
                ),
                codigoFormatado
            ),
        ];
    }
}