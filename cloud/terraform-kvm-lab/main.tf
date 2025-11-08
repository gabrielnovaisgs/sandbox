terraform {
  required_providers {
    libvirt = {
      source  = "dmacvicar/libvirt"
      version = "~>0.9"
    }
  }
}

provider "libvirt" {
  uri = "qemu:///system"
}

resource "libvirt_volume" "ubuntu_base" { # create the imutable image
  name   = "ubuntu-base.qcow2"            # name creates
  pool   = "iso"                          # wich pool it will be storage 
  format = "qcow2"                        # the format saved
  create = {
    content = { # from where ? can be local too
      url = "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
    }
  }
}

resource "libvirt_volume" "vm_disk" { # the overlay (backed) image
  name     = "ubuntu-vm-1.qcow2"      # the name saved
  format   = "qcow2"                  # the format to save
  pool     = "iso"
  capacity = 20 * 1024 * 1024 * 1024 # 20GB em bytes

  backing_store = {
    path   = libvirt_volume.ubuntu_base.path # the path for the backing image
    format = "qcow2"                         # the format to read
  }
}

resource "libvirt_cloudinit_disk" "commoninit" { # create the "cd room"
  name      = "commoninit"
  user_data = file("${path.module}/cloud-init/user-data.yaml")
  meta_data = file("${path.module}/cloud-init/user-data.yaml")
}

resource "libvirt_volume" "vm1_cloudinit" {
  name = "vm1-cloudinit.iso"
  pool = "iso"
  create = {
    content = {
      url = libvirt_cloudinit_disk.commoninit.path
    }
  }
}


resource "libvirt_domain" "vm1" {
  name   = "ubuntu-vm-1"
  memory = 2 * 1024 * 1024
  vcpu   = 2
  os = {
    type    = "hvm"
    arch    = "x86_64"
    machine = "q35"
  }
  devices = {
    disks = [
      {
        target = {
          dev = "vda"
          bus = "virtio"
        }
        source = {
          pool   = libvirt_volume.vm_disk.pool
          volume = libvirt_volume.vm_disk.name
        }
      },
      {
        device = "cdrom"
        source = {
          pool   = libvirt_volume.vm1_cloudinit.pool
          volume = libvirt_volume.vm1_cloudinit.name
        }
        target = {
          dev = "sda"
          bus = "sata"
        }

      }
    ]

    interfaces = [
      {
        type  = "network"
        model = "virtio"
        source = {
          network = "default"
        }
      }
    ]

    graphics = {
      vnc = {
        autoport = "yes"
        listen   = "127.0.0.1"
      }
    }

  }
  running = true

}
