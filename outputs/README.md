# Valent Estacionamentos — Landing page

Landing page responsiva do Valent Estacionamentos e Lava-rápido, feita com HTML, CSS e JavaScript sem framework no navegador. Inclui fotos do local, serviços, preços, horários, FAQ, mapa, WhatsApp e cadastro de interesse.

## Publicação

O site está publicado em https://estacionamento-v2.vercel.app. O projeto Vercel usa esta pasta (`outputs`) como diretório raiz, com a função serverless `api/clientes.js`.

## Cadastro e Supabase

O endpoint `POST /api/clientes` valida os dados e insere nome, WhatsApp, veículo, placa e interesse em `public.site_leads` usando a chave pública `NEXT_PUBLIC_SUPABASE_ANON_KEY`. A tabela tem RLS habilitada e só permite que visitantes enviem cadastros com consentimento; eles não podem ler os registros. Não há chave administrativa no navegador nem no repositório.

As variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` devem estar definidas na Vercel para produção e preview. A tabela e a política estão documentadas em `supabase/schema.sql` e foram aplicadas no projeto Supabase conectado.

## Estrutura

- `index.html` — landing page e formulário.
- `assets/` — fotos fornecidas para o projeto.
- `api/clientes.js` — endpoint seguro de cadastro.
- `admin.html` — painel protegido para editar e excluir cadastros em `/admin`, com listas de ativos e expirados.
- `api/config.js` — fornece ao navegador somente a URL e a chave pública do Supabase.
- `supabase/schema.sql` — estrutura e política RLS do cadastro.

## Acesso administrativo

O usuário precisa ter uma conta no Supabase Auth e ser incluído por um responsável na tabela privada `public.site_admins`. A RLS autoriza leitura, edição e exclusão de `site_leads` somente para membros dessa tabela. Cadastros com mais de sete dias ficam na lista Expirados e continuam guardados até exclusão manual. O painel sinaliza cadastros feitos hoje como novos e os recebidos há mais de dois dias como antigos.

O link **Esqueci ou ainda não tenho uma senha** envia a recuperação para o e-mail informado. O retorno `https://estacionamento-v2.vercel.app/admin` deve constar em Authentication → URL Configuration → Redirect URLs no Supabase.


