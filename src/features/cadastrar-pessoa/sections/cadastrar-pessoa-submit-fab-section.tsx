import { BrandFab } from '@/components/brand-fab';
import { MaxContentWidth, PageGutter } from '@/constants/theme';
import type { CadastrarPessoaController } from '@/features/cadastrar-pessoa/cadastrar-pessoa.controller';
import { useBottomSafeInset } from '@/lib/use-bottom-safe-inset';
import { useWideLayout } from '@/lib/use-wide-layout';

interface CadastrarPessoaSubmitFabSectionProps {
  controller: CadastrarPessoaController;
}

/** FAB de cadastro — some quando o botão inline do formulário fica visível. */
export function CadastrarPessoaSubmitFabSection({
  controller,
}: CadastrarPessoaSubmitFabSectionProps) {
  const bottomInset = useBottomSafeInset();
  const { isWide, width } = useWideLayout();
  const bottom = isWide ? bottomInset + 8 : bottomInset + 72;

  // Alinha à borda direita do ContentShell (form), não à janela.
  const shellWidth = Math.min(width, MaxContentWidth);
  const right = (width - shellWidth) / 2 + PageGutter;

  return (
    <BrandFab
      accessibilityLabel="Cadastrar"
      icon="plus"
      loading={controller.submitting}
      visible={!controller.nearFormEnd}
      onPress={controller.handleRegister}
      style={{ bottom, right }}
    />
  );
}
