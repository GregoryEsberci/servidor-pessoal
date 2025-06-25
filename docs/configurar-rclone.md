# Configurar o rclone

<!-- Bom, não vou usar mais, mas não tem pq apagar já q a doc tá pronta -->

Usado pra se conectar com o google drive

----

Conecte por ssh com `-L localhost:53682:localhost:53682`, so confia, [vai ser util depois](https://rclone.org/remote_setup/#configuring-using-ssh-tunnel)

```sh
ssh -L localhost:53682:localhost:53682 username@remote_server
```

Configure o storage no rclone

```sh
rclone config
```

Passos:

1. n (new remote)

2. name: gdrive (ou qualquer outro)

3. storage: drive (Google Drive)

4. configurar client_id e client_secret: https://rclone.org/drive/#making-your-own-client-id

5. scope: drive

6. service_account_file: (em branco, so dar enter)

7. Edit advanced config?: n

8. Use auto config? y

9. copiar o link (ex: http://127.0.0.1:53682/auth?state=abcd) e abra no navegador, so seguir os passos

10. Configure this as a Shared Drive (Team Drive)?: n

11. Confiar se tá tudo ok e seguir (y)

12. Finalizar com q

----

## Testar

```sh
rclone ls gdrive:/
```
