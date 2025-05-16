"use client";

import Button from "@/app/components/Buttons";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CheckBox from "@/app/components/inputs/CheckBox";
import Input from "@/app/components/inputs/input";
import SelectColor from "@/app/components/inputs/SelectColors";
import TextArea from "@/app/components/inputs/TextArea";
import { Categories } from "@/utils/Categories";
import { Colors } from "@/utils/Colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const AddProductForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>(null);
  const [isProductCreated, setIsProductCreated] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: "",
    },
  });

  useEffect(() => {
    setCustomValue("images", images);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (!data.category) {
      setIsLoading(false);
      return toast.error("Category is not selected!");
    }

    if (!images || images.length === 0) {
      setIsLoading(false);
      return toast.error("No selected image!");
    }

    let uploadedImages: UploadedImageType[] = [];

    const handleImageUploads = async () => {
      toast("Uploading images, please wait...");
      try {
        for (const item of images) {
          if (item.image) {
            const imageUrl = await uploadToCloudinary(item.image);
            uploadedImages.push({
              color: item.color,
              colorCode: item.colorCode,
              image: imageUrl,
            });
          }
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        toast.error("Error uploading images to Cloudinary!");
        throw error;
      }
    };

    try {
      await handleImageUploads();

      const productData = { ...data, images: uploadedImages };
      await axios.post("/api/product", productData);

      toast.success("Product created");
      setIsProductCreated(true);
      router.refresh();
    } catch {
      toast.error("Something went wrong when connecting to the database");
    } finally {
      setIsLoading(false);
    }
  };

  const category = watch("category");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        return prev.filter((item) => item.color !== value.color);
      }
      return prev;
    });
  }, []);

  return (
    <>
      <Heading title="Add a Product" center />
      <Input
        id="name"
        label="name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="Price"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
        required
      />
      <Input
        id="brand"
        label="brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CheckBox id="inStock" register={register} label="This product is in stock" />
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
          {Categories.map((item) => {
            if (item.label === "ALL") {
              return null;
            }

            return (
              <div key={item.label} className="col-span">
                <CategoryInput
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.Icon}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">Select the available product colors and upload their Images.</div>
          <div className="text-sm">
            You must select an image for each of the colors selected otherwise your color selections will be ignored.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Colors.map((item, index) => {
            return (
              <SelectColor
                key={index}
                item={item}
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProductCreated={isProductCreated}
              />
            );
          })}
        </div>
      </div>
      <Button label={isLoading ? "Loading..." : "AddProduct"} onClick={handleSubmit(onSubmit)} />
    </>
  );
};

export default AddProductForm;
