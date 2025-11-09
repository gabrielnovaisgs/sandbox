#cloud-config
hostname: ${hostname}
fqdn: ${hostname}.local

users:
  - name: gabriel
    groups: sudo
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ${ssh_key}
    lock_passwd: false
    passwd: '$6$rounds=4096$ED.genr8O/IZRcad$WcIGeY7ebeWKa4SEkJIrq/AHG.8wRBue1vsVi9FNeqPK7HVFmAlXI/TeAO2XZ.nVTwem4gCHDXFGvWfukP9MP/'  # senha: ubuntu (para backup)

ssh_pwauth: true

network:
  version: 2
  ethernets:
    enp1s0:
      dhcp4: true # Activate DHCP to have an ip address

packages:
  - vim
  - curl
  - wget
  - htop
  - python3

package_update: true
package_upgrade: false

timezone: America/Sao_Paulo

final_message: "VM pronta em $UPTIME segundos!"

