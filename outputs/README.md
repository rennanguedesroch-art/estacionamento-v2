# Valent Estacionamentos — Landing page

Landing page responsiva do Valent Estacionamentos e Lava-rápido, feita com HTML, CSS e JavaScript sem framework no navegador. Inclui fotos do local, serviços, preços, horários, FAQ, mapa, WhatsApp e cadastro de interesse.

## Publicação

O site está publicado em https://estacionamento-v2.vercel.app. O projeto Vercel usa esta pasta (`outputs`) como diretório raiz, com a função serverless `api/clientes.js`.

## Cadastro e Supabase

O endpoint `POST /api/clientes` valida os dados e insere em `public.site_leads` usando a chave pública `NEXT_PUBLIC_SUPABASE_ANON_KEY`. A tabela tem RLS habilitada e só permite que visitantes enviem cadastros com consentimento; eles não podem ler os registros. Não há chave administrativa no navegador nem no repositório.

As variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` devem estar definidas na Vercel para produção e preview. A tabela e a política estão documentadas em `supabase/schema.sql` e foram aplicadas no projeto Supabase conectado.

## Estrutura

- `index.html` — landing page e formulário.
- `assets/` — fotos fornecidas para o projeto.
- `api/clientes.js` — endpoint seguro de cadastro.
- `admin.html` — painel protegido para consultar cadastros em `/admin`.
- `api/config.js` — fornece ao navegador somente a URL e a chave pública do Supabase.
- `supabase/schema.sql` — estrutura e política RLS do cadastro.

## Acesso administrativo

O usuário precisa ter uma conta no Supabase Auth e ser incluído por um responsável na tabela privada `public.site_admins`. O painel não cria administradores nem permite alteração ou exclusão dos cadastros. A RLS autoriza a leitura de `site_leads` apenas para membros dessa tabela.

O link **Esqueci ou ainda não tenho uma senha** envia a recuperação para o e-mail informado. O retorno `https://estacionamento-v2.vercel.app/admin` deve constar em Authentication → URL Configuration → Redirect URLs no Supabase.

