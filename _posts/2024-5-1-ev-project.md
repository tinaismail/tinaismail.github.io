---
layout: post
title: AEV Project
subtitle: ELECENG 3EY4
thumbnail-img: assets/img/ev-project/McMaster_AEV.png
share-img: assets/img/ev-project/McMaster_AEV.png
tags: [engineering]
author: Tina Ismail
---
This project was completed as part of a university course focused on the development of an **Autonomous Electric Vehicle (AEV)** using a 1/10-scale RC vehicle platform. The project combined electric motor drives, embedded systems, vehicle control, and autonomous driving, providing hands-on experience across both the hardware and software of a robotic vehicle.

The vehicle was developed using concepts and software from the [**F1TENTH project**](https://f1tenth.org/). Over the course of the project, I worked with **Linux, ROS, C/C++, Python, MATLAB/Simulink, NVIDIA Jetson Nano, VESC motor controllers, LiDAR, and camera-based sensing**.

![](/assets/img/ev-project/McMaster_AEV.png)

The final platform integrated a **Jetson Nano** for onboard computation, **LiDAR and camera sensors** for perception, and a **VESC** for propulsion and steering control. This hardware was used to explore several levels of vehicle automation: manual control, driver assistance with collision avoidance, and fully autonomous navigation.

## Electric Propulsion and Motor Control

The first part of the project focused on understanding the vehicle's electric drivetrain.

The chassis uses a **three-phase brushless permanent-magnet motor** for propulsion and a servomotor for steering. A VESC motor controller drives the traction motor using **sensorless field-oriented control (FOC)** while also providing an interface for steering commands.

![Vehicle chassis and drivetrain](/assets/img/ev-project/chassis.png)

![VESC motor controller](/assets/img/ev-project/VESC.png)

Working with this system gave me practical exposure to the relationship between the electrical behaviour of a motor and the higher-level software commands used to control a vehicle.

The traction motor is a **surface-mounted permanent-magnet synchronous motor (PMSM)** designed for RC applications. It is rated at approximately **3200 kV** and uses a four-pole rotor.

![Brushless traction motor](/assets/img/ev-project/brushless_motor.png)

### Motor Characterization

![Disassembled motor components](/assets/img/ev-project/Pasted%20image%2020240223000013.png)

![Motor stator and rotor cross-sections](/assets/img/ev-project/Pasted%20image%2020240223000033.png)

I performed an **open-circuit back-EMF test**, where the motor was mechanically rotated while its induced voltage was measured using an oscilloscope. This demonstrated experimentally that the generated back-EMF increases approximately linearly with rotor speed.

![Back-EMF measurement](/assets/img/ev-project/Pasted%20image%2020240223001316.png)

The measurements were used to estimate the motor's permanent-magnet flux linkage using

$$
\lambda_{PM} = \frac{E}{\omega_e}
$$

where (E) is the measured back-EMF and (\omega_e) is the electrical angular velocity.

Plotting the measurements against electrical frequency showed the expected linear relationship between speed and induced voltage, while the calculated flux linkage remained approximately constant across the operating points.

![Measured line-to-line voltage and calculated flux linkage](/assets/img/ev-project/Pasted%20image%2020240223001646.png)

This exercise helped connect several concepts that are easy to treat separately in theory: **motor geometry, permanent-magnet flux, back-EMF, electrical frequency, torque production, and field-oriented control**. I also gained experience comparing experimental measurements with analytical calculations and finite-element motor models.

## Autonomous Driving

The second half of the project shifted from the drivetrain to the autonomous vehicle stack.

Using **ROS on an NVIDIA Jetson Nano**, I worked with the vehicle's sensors and control interfaces to develop and test functionality ranging from manual driving to autonomous operation. The work built on the open-source **F1TENTH** software ecosystem and introduced the structure of a typical autonomous robotics pipeline.

The main areas I worked with included:

* **ROS-based software development and integration**
* **LiDAR and camera sensing**
* **Vehicle steering and velocity control**
* **Collision avoidance and driver-assistance logic**
* **Autonomous path planning and navigation**
* **Localization and mapping (SLAM)**
* **Linux-based development and debugging on embedded hardware**
* **Python and C/C++ for robotics applications**

One of the most useful aspects of the project was seeing how these areas interact on a physical system. A planning or perception algorithm ultimately has to produce commands that pass through ROS, execute on embedded hardware, reach the VESC, and result in the expected motion of the vehicle.

## What I Took Away

This project gave me experience working across the stack of an autonomous electric vehicle rather than treating propulsion, embedded computing, perception, and control as isolated topics.

On the hardware and controls side, I gained practical experience with **brushless motor construction, PMSM modelling, back-EMF measurement, flux-linkage estimation, field-oriented control, VESC configuration, and MATLAB/Simulink**. On the autonomous systems side, I developed experience with **ROS, Linux, Python, C/C++, LiDAR, camera sensing, SLAM, collision avoidance, planning, and vehicle control**.

More importantly, the project gave me experience integrating these components on a real electric vehicle, where software, electronics, sensors, actuators, and physical vehicle dynamics all have to work together.
