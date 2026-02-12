
# Orbital Guardians

**Orbital Guardians** is a physics-informed system for analyzing near-miss collision risks between space objects using orbital data, analytical modeling, and interactive visualization.

The project focuses on understanding conjunction events, relative motion in orbit, and risk assessment of space debris to support space situational awareness.

---

## 🔭 Project Overview

With the increasing density of objects in Earth orbit, the risk of collision between operational satellites and space debris has become a critical challenge.

Orbital Guardians aims to:
- Analyze close-approach (near-miss) events between space objects
- Visualize orbital behavior and conjunction trends
- Provide interpretable risk indicators based on orbital geometry and relative motion

This project is designed as a **learning-oriented, research-style system**, emphasizing clarity of logic and explainability over black-box predictions.

---

## 🧠 System Architecture (High Level)

1. **Orbital Data Layer**
   - Orbital parameters (e.g., TLE-based or simulated data)
   - Time-indexed object state information

2. **Analysis Layer**
   - Relative distance and velocity computation
   - Detection of close-approach events
   - Rule-based and analytical risk indicators

3. **Visualization Layer**
   - Interactive dashboards
   - Temporal and spatial trend analysis
   - Orbital and conjunction visualizations

4. **Presentation Layer**
   - Web-based UI for exploration and interpretation
   - Focus on clarity and explainability

---

## 🛠️ Technology Stack

This project is built using:

- **Vite** – fast build tooling
- **React + TypeScript** – structured and type-safe UI development
- **Tailwind CSS** – utility-first styling
- **shadcn/ui & Radix UI** – accessible UI components
- **Three.js / React Three Fiber** – orbital and 3D visualization
- **Recharts** – analytical charts and trend visualization
- **Vitest** – testing framework

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (LTS recommended)
- npm

### Installation & Run

```sh
# Clone the repository
git clone https://github.com/Sachin-chaurasiya07/Orbital-Guardians.git

# Navigate to the project directory
cd Orbital-Guardians

# Install dependencies
npm install

# Start the development server
npm run dev

