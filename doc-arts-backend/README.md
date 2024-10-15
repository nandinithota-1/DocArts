# Installation Guide

This guide provides step-by-step instructions to install the necessary tools for setting up the development environment for both the backend and UI components of this project. The repository contains two main folders:

- `doc-arts-backend`: Contains the server-side code.
- `doc-arts-ui`: Contains the client-side code.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install Git](#install-git)
    - [Windows](#git-on-windows)
    - [macOS](#git-on-macos)
- [Install Java SDK 17 (Amazon Corretto 17)](#install-java-sdk-17-amazon-corretto-17)
    - [Windows](#java-on-windows)
    - [macOS](#java-on-macos)
- [Install Apache Maven](#install-apache-maven)
    - [Windows](#maven-on-windows)
    - [macOS](#maven-on-macos)
- [Install Node.js and npm](#install-nodejs-and-npm)
    - [Windows](#node-on-windows)
    - [macOS](#node-on-macos)
- [Setting Up the Backend](#setting-up-the-backend)
- [Setting Up the UI](#setting-up-the-ui)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Administrative rights on your machine.
- Stable internet connection.

---

## Install Git

Git is required for cloning the repository and version control.

### Git on Windows

1. **Download Installer:**
    - Visit [Git for Windows](https://git-scm.com/download/win) and download the latest installer.

2. **Run Installer:**
    - Execute the downloaded `.exe` file.
    - Follow the installation prompts. Use default settings unless specific configurations are needed.

3. **Verify Installation:**
    - Open **Command Prompt** and run:
      ```bash
      git --version
      ```

### Git on macOS

#### Option 1: Xcode Command Line Tools

1. **Install Command Line Tools:**
    - Open **Terminal** and run:
      ```bash
      xcode-select --install
      ```
    - Follow the prompts to complete the installation.

#### Option 2: Homebrew (If Homebrew is installed)

1. **Install Git via Homebrew:**
    - Run:
      ```bash
      brew install git
      ```

2. **Verify Installation:**
    - Run:
      ```bash
      git --version
      ```

---

## Install Java SDK 17 (Amazon Corretto 17)

Java SDK 17 is required for building and running the backend application.

### Java on Windows

1. **Download Amazon Corretto 17:**
    - Visit [Amazon Corretto Downloads](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html).
    - Download the MSI installer for Windows x64.

2. **Install Java:**
    - Run the downloaded `.msi` file.
    - Follow the installation prompts.

3. **Set `JAVA_HOME` Environment Variable:**
    - Go to **Control Panel** > **System and Security** > **System** > **Advanced system settings**.
    - Click **Environment Variables**.
    - Under **System variables**, click **New** and add:
        - **Variable name:** `JAVA_HOME`
        - **Variable value:** `C:\Program Files\Amazon Corretto\jdk17.0.x_x64` (adjust the path if necessary)
    - Edit the **Path** variable and add `%JAVA_HOME%\bin`.

4. **Verify Installation:**
    - Open **Command Prompt** and run:
      ```bash
      java -version
      ```

### Java on macOS

1. **Download Amazon Corretto 17:**
    - Visit [Amazon Corretto Downloads](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html).
    - Download the PKG installer for macOS x64 or ARM64 (depending on your Mac).

2. **Install Java:**
    - Run the downloaded `.pkg` file.
    - Follow the installation prompts.

3. **Set `JAVA_HOME` Environment Variable:**
    - Open **Terminal**.
    - Run:
      ```bash
      echo 'export JAVA_HOME=$(/usr/libexec/java_home -v17)' >> ~/.zshrc
      source ~/.zshrc
      ```
    - Adjust the shell profile file (`.bash_profile`, `.bashrc`, or `.zshrc`) as per your default shell.

4. **Verify Installation:**
    - Run:
      ```bash
      java -version
      ```

---

## Install Apache Maven

Maven is used for building and managing Java-based projects.

### Maven on Windows

1. **Download Maven:**
    - Visit [Apache Maven Download](https://maven.apache.org/download.cgi).
    - Download the **Binary zip archive**.

2. **Install Maven:**
    - Extract the zip file to `C:\Program Files\Apache\Maven`.

3. **Set `MAVEN_HOME` Environment Variable:**
    - Go to **Environment Variables** as described earlier.
    - Add a new system variable:
        - **Variable name:** `MAVEN_HOME`
        - **Variable value:** `C:\Program Files\Apache\Maven\apache-maven-3.9.6`
    - Edit the **Path** variable and add `%MAVEN_HOME%\bin`.

4. **Verify Installation:**
    - Open **Command Prompt** and run:
      ```bash
      mvn -version
      ```

### Maven on macOS

#### Option 1: Homebrew

1. **Install Maven:**
    - Run:
      ```bash
      brew install maven
      ```

2. **Verify Installation:**
    - Run:
      ```bash
      mvn -version
      ```

#### Option 2: Manual Installation

1. **Download Maven:**
    - Visit [Apache Maven Download](https://maven.apache.org/download.cgi).
    - Download the **Binary tar.gz archive**.

2. **Install Maven:**
    - Extract the archive to `/usr/local/apache-maven`.

3. **Set Environment Variables:**
    - Open **Terminal**.
    - Run:
      ```bash
      echo 'export M2_HOME=/usr/local/apache-maven/apache-maven-3.x.x' >> ~/.zshrc
      echo 'export PATH=$M2_HOME/bin:$PATH' >> ~/.zshrc
      source ~/.zshrc
      ```

4. **Verify Installation:**
    - Run:
      ```bash
      mvn -version
      ```

---

## Install Node.js and npm

Node.js and npm are required for running the UI application.

### Node on Windows

1. **Download Installer:**
    - Visit [Node.js Downloads](https://nodejs.org/en/download/).
    - Download the Windows Installer.

2. **Install Node.js and npm:**
    - Run the downloaded installer.
    - Follow the installation prompts.

3. **Verify Installation:**
    - Open **Command Prompt** and run:
      ```bash
      node -v
      npm -v
      ```

### Node on macOS

#### Option 1: Homebrew

1. **Install Node.js and npm:**
    - Run:
      ```bash
      brew install node
      ```

2. **Verify Installation:**
    - Run:
      ```bash
      node -v
      npm -v
      ```

#### Option 2: Installer

1. **Download Installer:**
    - Visit [Node.js Downloads](https://nodejs.org/en/download/).
    - Download the macOS Installer.

2. **Install Node.js and npm:**
    - Run the downloaded installer.
    - Follow the installation prompts.

3. **Verify Installation:**
    - Run:
      ```bash
      node -v
      npm -v
      ```

---

## Setting Up the Backend

1. **Clone the Repository:**
    - Open your terminal or command prompt.
    - Run:
      ```bash
      git clone "https://github.com/nandinithota-1/DocArts.git">
      ```
2. **Navigate to the Backend Directory:**
    - Run:
      ```bash
      cd backend
      ```

3. **Build the Project:**
    - Run:
      ```bash
      mvn clean install
      ```

4. **Run the Application:**
    - Run:
      ```bash
      mvn spring-boot:run
      ```
    - The application should now be running on `http://localhost:8080` (or your configured port).

---

## Setting Up the UI

1. **Navigate to the UI Directory:**
    - From the root directory, run:
      ```bash
      cd ui
      ```

2. **Install Dependencies:**
    - Run:
      ```bash
      npm install
      ```

3. **Start the Development Server:**
    - Run:
      ```bash
      npm start
      ```
    - The UI application should now be running on `http://localhost:3000` (or your configured port).

---

## Troubleshooting

- **Environment Variables Not Recognized:**
    - Ensure that you have restarted your terminal or command prompt after setting environment variables.
    - Double-check the paths in your environment variables.

- **Permission Issues on macOS:**
    - You may need to prepend `sudo` to your install commands:
      ```bash
      sudo brew install <package>
      ```
    - Enter your password when prompted.

- **Port Conflicts:**
    - If the default ports are in use, configure your applications to run on different ports.

- **Outdated Package Errors:**
    - For Node.js dependencies, you may need to update packages:
      ```bash
      npm update
      ```

- **Further Assistance:**
    - Refer to the official documentation of each tool:
        - [Git Documentation](https://git-scm.com/doc)
        - [Amazon Corretto Documentation](https://docs.aws.amazon.com/corretto/)
        - [Maven Documentation](https://maven.apache.org/guides/index.html)
        - [Node.js Documentation](https://nodejs.org/en/docs/)
