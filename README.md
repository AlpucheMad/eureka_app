# Eureka App

Eureka App es una aplicación web desarrollada con Django 4.2 y Python 3.12 que permite a los usuarios gestionar entradas de diario, sesiones y más.

## Requisitos previos

- Python 3.12
- MySQL
- Pip

## Estructura del proyecto

El proyecto está organizado en varias aplicaciones Django:

- **eureka_app**: Aplicación principal y configuración del proyecto
- **eureka_app_account**: Gestión de cuentas de usuario
- **eureka_app_entry**: Gestión de entradas
- **eureka_app_journal**: Gestión de diarios
- **eureka_app_feed**: Gestión de feeds
- **eureka_app_session**: Gestión de sesiones

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd eureka_app
```

### 2. Crear y activar entorno virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en el directorio `eureka_app/` con el siguiente contenido:

```
# ALLOWED
ALLOWED_HOSTS=127.0.0.1,localhost

# SECURITY
SECRET_KEY=tu_clave_secreta_aqui

# DATABASE
DB_NAME=eureka_app
DB_USER=tu_usuario_mysql
DB_PASS=tu_contraseña_mysql
DB_HOST=localhost
DB_PORT=3306

# DEV ENV
DEBUG=True
```

### 5. Configurar la base de datos MySQL

```bash
# Crear la base de datos
mysql -u root -p
CREATE DATABASE eureka_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'eureka_django_user'@'localhost' IDENTIFIED BY 'tu_contraseña';
GRANT ALL PRIVILEGES ON eureka_app.* TO 'eureka_django_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 6. Aplicar migraciones

```bash
python manage.py migrate
```

### 7. Crear superusuario

```bash
python manage.py createsuperuser
```

### 8. Ejecutar el servidor de desarrollo

```bash
python manage.py runserver
```

La aplicación estará disponible en http://localhost:8000/

## Dependencias principales

- Django 4.2.7
- django-environ 0.12.0
- mysqlclient 2.2.0
- python-dateutil 2.9.0.post0
- requests 2.32.3

## Estructura de directorios

- **eureka_app/**: Configuración principal del proyecto
- **eureka_app_account/**: Gestión de cuentas de usuario
- **eureka_app_entry/**: Gestión de entradas
- **eureka_app_journal/**: Gestión de diarios
- **eureka_app_feed/**: Gestión de feeds
- **eureka_app_session/**: Gestión de sesiones
- **templates/**: Plantillas HTML
- **static/**: Archivos estáticos (CSS, JS, imágenes)
- **logs/**: Archivos de registro

## Desarrollo

### Crear archivo de requisitos

Para generar o actualizar el archivo `requirements.txt`:

```bash
pip freeze > requirements.txt
```

### Ejecutar pruebas

```bash
python manage.py test
```

## Licencia

[Especificar la licencia del proyecto] 