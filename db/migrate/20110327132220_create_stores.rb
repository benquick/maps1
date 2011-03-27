class CreateStores < ActiveRecord::Migration
  def self.up
    create_table :stores do |t|
      t.column :name, :string, :limit=>50
      t.column :address, :string, :limit=>100
      t.column :address2, :string, :limit=>100
      t.column :city, :string, :limit=>50
      t.column :state, :string, :limit=>2
      t.column :zip, :string, :limit=>9
      t.column :phone, :string, :limit=>15
      t.column :lat, :string, :limit=>20
      t.column :lng, :string, :limit=>20
    end
  end

  def self.down
    drop_table :stores
  end

end
