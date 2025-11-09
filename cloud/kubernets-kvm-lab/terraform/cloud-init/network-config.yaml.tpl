#cloud-config
version: 2
ethernets:
  enp1s0: # Este é o nome da interface de rede. No KVM/virtio é quase sempre eth0
    dhcp4: no                     # Desliga o DHCP
    addresses: [${ip_address}/24]        # <--- O IP estático e a máscara (em notação CIDR)
    gateway4: 192.168.124.1       # <--- O "portão" da rede
    nameservers:
      addresses: [192.168.124.1, 8.8.8.8] # Servidores DNS