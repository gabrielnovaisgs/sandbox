#!/bin/bash

BASE_IMAGE="/home/gabriel/.kvm/iso/noble-server-cloudimg-amd64.img"
WORKING_IMAGE="/home/gabriel/.kvm/iso/ubuntu-lab.qcow2"

sudo rm -rf seed.img
sudo virsh destroy ubuntu-lab 2>/dev/null
sudo virsh undefine ubuntu-lab 2>/dev/null

# Usar backing file (muito mais rápido)
echo "Creating overlay disk..."
sudo rm -f "$WORKING_IMAGE"
sudo qemu-img create -f qcow2 -F qcow2 -b "$BASE_IMAGE" "$WORKING_IMAGE" 20G

echo "Creating cloud-init seed..."
sudo cloud-localds seed.img user-data.yaml meta-data.yaml

echo "Creating VM..."
sudo virt-install --name ubuntu-lab \
  --os-variant ubuntu24.04 \
  --vcpus 2 \
  --ram 3096 \
  --disk path="$WORKING_IMAGE",device=disk \
  --disk path=/home/gabriel/personal/sandbox/cloud/cloud-init/seed.img,device=cdrom \
  --network network=default,model=virtio \
  --graphics none \
  --console pty,target_type=serial \
  --import \
  --noautoconsole

echo "Waiting for VM to initialize..."  
sleep 60
echo "Ready! Connect with: sudo virsh console ubuntu-lab"